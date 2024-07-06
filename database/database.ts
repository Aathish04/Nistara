import { Client, types } from "cassandra-driver";
import { sha256 } from 'js-sha256';

export class dbClient {
  client: Client = new Client({
    cloud: {
      secureConnectBundle: "secure-connect-nistaradb.zip",
    },
    credentials: {
      username: "ElaDTDRfxOXseDeQUOHjzwxl",
      password: "TQTnd,Y7AMfWGeOkpmQ-M8ULOgQ_S,JTGpxSxFb+m0,3cxZQT1uTAkh.09msIE1faDZawRsPIYiF8oecAxBEgjImnPQFbafLkQSYUppD_XBglPKoEQN4KXYy22_Rmfpd",
    },
  });

  constructor() {
    this.connect();
  }

  async connect() {
    try {
      await this.client.connect();
      console.log('Connected to Cassandra');
    } catch (err) {
      console.error('Failed to connect to Cassandra:', err);
    }
  }

  async addPost(userID: number, textualInfo: string, multimediaURL: string[], timestamp: number, geoLocation: [number, number]) {
    let postID: string = sha256(String(userID) + textualInfo + String(multimediaURL) + timestamp + String(geoLocation)) ;
    try {
      let query = "INSERT INTO main.POSTS (postID, userID, textualInfo, multimediaURL, timestamp, geoLocation, classifier, isClassified) VALUES (?, ?, ?, ?, ?, ?, -1, false);";

      // Create a tuple for geoLocation
      const geoLocationTuple = new types.Tuple(geoLocation[0], geoLocation[1]);

      await this.client.execute(query, [postID, userID, textualInfo, multimediaURL, timestamp, geoLocationTuple], {prepare:true});
    } catch (e) {
      console.error(e);
      return {"message":"Failed Adding Post"}
    }
    let query = "SELECT * FROM main.POSTS where postID= ?;"
    let res = await this.client.execute(query,[postID],{prepare:true})
    console.log(res.rows[0])
    if (res.rows[0]){
      console.log("Post added successfully");
      return {"message":"Post Added Successfully"}
    }
    
    return {"message":"Failed Adding Post"}
  }
}

