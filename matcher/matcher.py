from logging import getLogger, basicConfig, INFO, DEBUG
from os import environ
import json
import time
import numpy as np
from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider
from cassandra.query import dict_factory
from datetime import datetime
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer

load_dotenv()
basicConfig(level=DEBUG)
logger = getLogger(__name__)

INSTANCEID = int(environ.get('INSTANCEID', -2))
UNMATCHED_MATCHER_ID = -1
SIMILARITY_THRESHOLD = 0.7

cloud_config = {
    'secure_connect_bundle': 'secure-connect-nistaradb.zip'
}

with open("NistaraDB-token.json") as f:
    secrets = json.load(f)

CLIENT_ID = secrets["clientId"]
CLIENT_SECRET = secrets["secret"]
auth_provider = PlainTextAuthProvider(CLIENT_ID, CLIENT_SECRET)
cluster = Cluster(cloud=cloud_config, auth_provider=auth_provider)
session = cluster.connect()
session.row_factory = dict_factory

logger.info("Connected to Cassandra cluster.")

model = SentenceTransformer('all-mpnet-base-v2', cache_folder='.')

def getSimilarity(requestedItem, donatedItem):
    logger.info(f"Comparing {requestedItem} and {donatedItem}")
    requestedItemEmbedding = model.encode(f"'item_name':'{requestedItem}'", normalize_embeddings=False)
    donatedItemEmbedding = model.encode(f"'item_name':'{donatedItem}'", normalize_embeddings=False)
    similarity = model.similarity(requestedItemEmbedding, donatedItemEmbedding)
    logger.debug(f"Comparison Score of {requestedItem} and {donatedItem}: {similarity}")
    return similarity

def getAllRequests():
    query = "SELECT id FROM main.requests WHERE postclass = ? ALLOW FILTERING"
    prepared_statement = session.prepare(query)
    allRequestIds = session.execute(prepared_statement, ('REQUEST_ITEM',), trace=True)
    filteredreqs = [i['id'] for i in allRequestIds]
    logger.info(filteredreqs)
    return filteredreqs

def distancescore(request,donation):
    distance= 1-((np.linalg.norm(np.array(request["geolocation"]) - np.array(donation["geolocation"])))/100)
    return distance

def releaseRequest(request):
    query = 'UPDATE main.requests SET matcherid = ? where id = ?;'
    prepared_statement = session.prepare(query)
    session.execute(prepared_statement, (UNMATCHED_MATCHER_ID, request["id"]), trace=True)
    logger.info(f"Released Request {request['id']} for Matcher {INSTANCEID}")

def getAndMatchAllRequests():
    allrequestids = getAllRequests()
    logger.info("Retrieved all request IDs: " + str(len(allrequestids)))

    for requestid in allrequestids:
        time.sleep(2)
        logger.debug(f"Processing request ID: {requestid}")

        query = "SELECT * from main.requests where id = ?"
        prepared_statement = session.prepare(query)
        result = session.execute(prepared_statement, (requestid,), trace=True)
        logger.debug(f"Executed query for request ID {requestid}")
        request = result.one()
        if request:
            logger.debug(f"Retrieved request: {request}")
            if request['matcherid'] in (UNMATCHED_MATCHER_ID, INSTANCEID):
                logger.info(f"Request ID {requestid} has no matcher/current instance is matcher.")
                
                query = 'UPDATE main.requests SET matcherid = ? where id = ?;'
                prepared_statement = session.prepare(query)
                session.execute(prepared_statement, (INSTANCEID, request["id"]), trace=True)
                logger.info(f"Acquired Request {requestid} for Matcher {INSTANCEID}")

                request_class = request['umbrellatype']
                query = 'SELECT * FROM main.donations WHERE umbrellatype = ? AND matcherid = ? AND ismatched = ? ALLOW FILTERING'
                prepared_statement = session.prepare(query)
                classed_donations = session.execute(prepared_statement, (request_class, UNMATCHED_MATCHER_ID, False), trace=True)
                logger.debug(f"Executed query for classed donations for request class {request_class}")

                if not classed_donations.current_rows:
                    logger.warning(f"NO RELEVANT DONATIONS FOR REQUEST CLASS {request_class}!")
                    releaseRequest(request)
                else:
                    similar_donations = list(filter(lambda donation: getSimilarity(request['item'], donation['item']) > SIMILARITY_THRESHOLD, classed_donations))
                    if similar_donations:
                        closest_similar_donation = min(similar_donations,key = lambda donation: np.linalg.norm(np.array(donation["geolocation"])-np.array(request["geolocation"])))
                        logger.info(f"Best donation match found: {closest_similar_donation}")
                        logger.info(f"Found Match: {request['id']}, {closest_similar_donation['id']}")
                        query = 'UPDATE main.requests SET ismatched = ? where id = ?;'
                        prepared_statement = session.prepare(query)
                        session.execute(prepared_statement, (True, request["id"]), trace=True)

                        query = 'UPDATE main.donations SET matcherid = ? where id = ?;'
                        prepared_statement = session.prepare(query)
                        session.execute(prepared_statement, (INSTANCEID, closest_similar_donation["id"]), trace=True)

                        query = 'UPDATE main.donations SET ismatched = ? where id = ?;'
                        prepared_statement = session.prepare(query)
                        session.execute(prepared_statement, (True, closest_similar_donation["id"]) ,trace=True)

                        query = 'INSERT INTO main.matches (requestid, donationid, matcherid, matchtime, donorAck, requesterAck) VALUES (?, ?, ?, ?, ?, ?);'
                        prepared_statement = session.prepare(query)
                        session.execute(prepared_statement, (request["id"], closest_similar_donation["id"], INSTANCEID, datetime.utcnow(), False, False))
                        logger.info(f"Updated Database with Match: {request['id']}, {closest_similar_donation['id']}")

                    else:
                        logger.warning(f"NO DONATIONS PASSING THRESHOLD FOR REQUEST {request['id']}!")
                        releaseRequest(request)
            else:
                logger.warning(f"NO UNMATCHED REQUEST WITH ID {requestid}")

if __name__ == "__main__":
    while True:
        getAndMatchAllRequests()