import torch
from IndicTransTokenizer import IndicProcessor
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
from logging import getLogger, basicConfig, INFO
from dotenv import load_dotenv
from logging import DEBUG
from os import environ
from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider
from cassandra.query import dict_factory

import json
load_dotenv()
ip = IndicProcessor(inference=True)

basicConfig(level=DEBUG)
logger = getLogger(__name__)
INSTANCEID:int = int(environ.get('INSTANCEID', -2))

tokenizer = AutoTokenizer.from_pretrained("ai4bharat/indictrans2-indic-en-dist-200M", trust_remote_code=True, cache_dir=".")
model = AutoModelForSeq2SeqLM.from_pretrained("ai4bharat/indictrans2-indic-en-dist-200M", trust_remote_code=True, cache_dir=".")

logger.info("Downloaded IndicTrans2 Model")

UNTRANSLATED_TRANSLATOR_ID=-1
# This secure connect bundle is autogenerated when you download your SCB, 
# if yours is different update the file name below
cloud_config= {
  'secure_connect_bundle': 'secure-connect-nistaradb.zip'
}

# This token JSON file is autogenerated when you download your token, 
# if yours is different update the file name below
with open("NistaraDB-token.json") as f:
    secrets = json.load(f)

CLIENT_ID = secrets["clientId"]
CLIENT_SECRET = secrets["secret"]
auth_provider = PlainTextAuthProvider(CLIENT_ID, CLIENT_SECRET)
cluster = Cluster(cloud=cloud_config, auth_provider=auth_provider)
session = cluster.connect()
session.row_factory = dict_factory

logger.info("Connected to Cassandra cluster.")

# sentences = [
#     "यह एक परीक्षण वाक्य है।"
# ]

def translate(sentence, src_lang, tgt_lang="eng_Latn"):
    logger.info(f"Translating sentence: {sentence}")

    batch = ip.preprocess_batch([sentence], src_lang=src_lang, tgt_lang=tgt_lang, show_progress_bar=True)
    batch = tokenizer(batch, padding="longest", truncation=True, max_length=256, return_tensors="pt")

    logger.info("Tokenization done")

    with torch.inference_mode():
        outputs = model.generate(**batch, num_beams=5, num_return_sequences=1, max_length=256)
    
    logger.info("Text generation done")

    with tokenizer.as_target_tokenizer():
    # This scoping is absolutely necessary, as it will instruct the tokenizer to tokenize using the target vocabulary.
    # Failure to use this scoping will result in gibberish/unexpected predictions as the output will be de-tokenized with the source vocabulary instead.
        outputs = tokenizer.batch_decode(outputs, skip_special_tokens=True, clean_up_tokenization_spaces=True)

    logger.info("Batch decode done")
    outputs = ip.postprocess_batch(outputs, lang=tgt_lang)
    logger.info(f"Postprocess batch done by translator {INSTANCEID}")
    logger.info(f"Translated sentence: {outputs[0]}")
    return outputs[0]


def getUntranslatedPost():
    query = f"SELECT * FROM main.POSTS WHERE (translator IN (?,?)) AND istranslated=? LIMIT 1 ALLOW FILTERING"
    prepared_statement = session.prepare(query)
    row = session.execute(prepared_statement, (-1, INSTANCEID,False), trace=True)
    try:
        row_entry = row[0]
        logger.info(f"Got untranslated post: {row_entry}")
        
        query = f"UPDATE main.POSTS SET translator=? WHERE id=?"
        prepared_statement = session.prepare(query)
        session.execute(prepared_statement, (INSTANCEID, row_entry["id"]), trace=True)
        logger.info(f"Acquired post {row_entry['id']}")
        
        query = f'SELECT istranslated FROM MAIN.POSTS WHERE id=?'
        prepared_statement = session.prepare(query)
        result = session.execute(prepared_statement, (row_entry["id"],), trace=True)
        logger.info(f"Acquisition result: {result[0]}")
        
        return row_entry
    except IndexError:
        logger.warning("No untranslated posts.")
        return None
    
def translatePost(untranslatedPost):
    try:
        sourceLanguage = untranslatedPost["language"]
        untranslatedText = untranslatedPost["textcontent"]
        translatedText = translate(untranslatedText,sourceLanguage)  
        query = f"UPDATE main.POSTS SET translatedtextcontent =?, istranslated=? WHERE id=?"
        prepared_statement = session.prepare(query)
        session.execute(prepared_statement, (translatedText,True, untranslatedPost["id"]), trace=True)
        logger.info(f"Translated post {untranslatedPost['id']}")

    except Exception as e:
        logger.info("Encountered Error :"+e)
        query = f"UPDATE main.POSTS SET translator=? WHERE id=?"
        prepared_statement = session.prepare(query)
        session.execute(prepared_statement, (UNTRANSLATED_TRANSLATOR_ID,untranslatedPost["id"]), trace=True)
        logger.info(f"Released post {untranslatedPost['id']}")




if __name__ == "__main__":
    # src = 'hin_Deva'
    # trg = 'eng_Latn'
    # translate("यह एक परीक्षण वाक्य है।",src,trg)
    while True:
        untranslatedpost = getUntranslatedPost()
        if untranslatedpost:
            translatePost(untranslatedpost)
        