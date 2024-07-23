import axios from 'axios';
import { sha256 } from 'js-sha256';
// import { Credential } from './env';



export enum  TABLES{
  mainPosts = "main.posts",
  mainRequests = "main.requests",
  mainDonations = "main.donations",
  mainMatches = "main.matches",
  mainUsers = "main.users"
};


interface User {
  userID: string,
  userName: string,
  address: string,
  dateOfBirth: string,
  gender: string,
  profileImage: string,
  maskedNumber: string, 
  email: string,
  phone: string,
  password: string,
  language: string
}

// const cred = new Credential();
// const ASTRA_DB_ID :string = cred.ASTRA_DB_ID
// const ASTRA_DB_REGION : string = cred.ASTRA_DB_REGION
// const ASTRA_DB_KEYSPACE : string = cred.ASTRA_DB_KEYSPACE
// const ASTRA_DB_APPLICATION_TOKEN : string = cred.ASTRA_DB_APPLICATION_TOKEN

const ASTRA_DB_ID : string | undefined = process.env.EXPO_PUBLIC_ASTRA_DB_ID
const ASTRA_DB_REGION : string | undefined = process.env.EXPO_PUBLIC_ASTRA_DB_REGION
const ASTRA_DB_KEYSPACE : string | undefined= process.env.EXPO_PUBLIC_ASTRA_DB_KEYSPACE
const ASTRA_DB_APPLICATION_TOKEN : string | undefined = process.env.EXPO_PUBLIC_ASTRA_DB_APPLICATION_TOKEN

const ASTRA_BASE_URL = `https://${ASTRA_DB_ID}-${ASTRA_DB_REGION}.apps.astra.datastax.com`;

export class dbClient {
  baseUrl: string;
  headers: object;

  constructor() {
    this.baseUrl = `${ASTRA_BASE_URL}/api/rest/v2/keyspaces/${ASTRA_DB_KEYSPACE}`;
    this.headers = {
      'Content-Type': 'application/json',
      'X-Cassandra-Token': ASTRA_DB_APPLICATION_TOKEN,
    };
  }

  async addPost(userid: string, username: string, profilephoto:string, textcontent: string, multimediaurl: string[], timestamp: number, geoLocation: [number, number], language:string) {
    let postID: string = sha256(String(userid) + textcontent + String(multimediaurl) + timestamp + String(geoLocation)).toString();
    const geoLocationStr = `(${geoLocation[0]},${geoLocation[1]})`
    console.log(geoLocationStr)
    let data: any;

    data = {
      id: postID,
      geolocation: geoLocationStr,
      multimediaurl,
      textcontent,
      timestamp : timestamp,
      lastupdatetimestamp: timestamp,
      userid,
      username,
      profilephoto,
      language,
      classifier: -1,
      isclassified: false,
      class: null
    }

    let payload: any
    if(language=='eng_Latn' || language=='en'){ // en cause currently db has en
    payload = {
        ...data,
        translator: -1,
        istranslated: true,
        translatedtextcontent: textcontent
      };
    }else{
      payload = {
        ...data,
        translator: -1,
        istranslated: false,
        translatedtextcontent: null
      }
    }
    try {
      await axios.post(`${this.baseUrl}/posts`, payload, { headers: this.headers });
      console.log('Post added successfully');
      return { message: 'Post Added Successfully' };
    } catch (e) {
      console.error('Failed Adding Post:', e);
      return { message: 'Failed Adding Post. Try again after some time!' };
    }
  }

  async getPosts() {
    try {
      let response = await axios.get(`${this.baseUrl}/posts/rows`, { headers: this.headers });
      const posts = response.data.data.map((post: any) => ({
        id: post.id,
        geolocation: post.geolocation,
        multimediaurl: post.multimediaurl,
        textcontent: post.textcontent,
        timestamp: post.timestamp,
        lastupdatetimestamp: post.lastupdatetimestamp,
        userid: post.userid,
        username: post.username,
        profilephoto: post.profilephoto,
        language: post.language,
        classifier: post.classifier,
        isclassified: post.isclassified,
        class: post.class,
        translator: post.translator,
        istranslated: post.istranslated,
        translatedtextcontent: post.translatedtextcontent
      }));
      return { message: 'Post Fetch Successful', result: posts };
    } catch (e) {
      console.error('Failed fetching all posts:', e);
      return { message: 'Failed fetching all posts', result: null };
    }
  }

  async getRequestPosts() {
    try {
      let response = await axios.get(`${this.baseUrl}/requests/rows`, { headers: this.headers });
      const requests = response.data.data.map((request: any)=>({
        id: request.id,
        umbrellatype: request.umbrellatype,
        item: request.item,
        quantity: request.quantity,
        postid: request.postid,
        geolocation: request.geolocation,
        translatedtextcontent: request.translatedtextcontent,
        timestamp: request.timestamp,
        postclass: request.postclass,
        userid: request.userid,
        username: request.username,
        profilephoto: request.profilephoto,
        matcherid: request.matcherid,
        ismatched: request.ismatched
      }))
      return { message: 'Request Posts Fetch Successful', result: requests};
    } catch (e) {
      console.error('Failed fetching all request posts:', e);
      return { message: 'Failed fetching all request posts', result: null };
    }
  }

  async getDonationPosts() {
    try {
      let response = await axios.get(`${this.baseUrl}/donations/rows`, { headers: this.headers });
      const donations = response.data.data.map((donation:any)=>({
        id: donation.id,
        umbrellatype: donation.umbrellatype,
        item: donation.item,
        quantity: donation.quantity,
        postid: donation.postid,
        geolocation: donation.geolocation,
        translatedtextcontent: donation.translatedtextcontent,
        timestamp: donation.timestamp,
        postclass: donation.postclass,
        userid: donation.userid,
        username: donation.username,
        profilephoto: donation.profilephoto,
        matcherid: donation.matcherid,
        ismatched: donation.ismatched
      }))
      return { message: 'Donation Posts Fetch Successful', result: donations };
    } catch (e) {
      console.error('Failed fetching all donation posts:', e);
      return { message: 'Failed fetching all donation posts', result: null };
    }
  }

  async getMatches() {
    try {
      let response = await axios.get(`${this.baseUrl}/matches/rows`, { headers: this.headers });
      const matches = response.data.data.map((match:any)=>({
        requestid :match.requestid,
        donationid : match.donationid,
        donorack : match.donorack,
        matcherid : match.matcherid,
        matchtime : match.matchtime,
        requesterack : match.requesterack,
      }))
      return { message: 'Matches Fetch Successful', result: matches };
    } catch (e) {
      console.error('Failed fetching all Matches:', e);
      return { message: 'Failed fetching all Matches', result: null };
    }
  }

  async getInformationPosts() {
    try {
      let response = await axios.get(`${this.baseUrl}/information/rows`, { headers: this.headers });
      const information = response.data.data.map((info: any)=>({
        postid: info.postid,
        userid: info.userid,
        textualinfo: info.textualinfo,
        multimediaurl: info.multimediaurl,
        geolocation: info.geolocation
      }))
      return { message: 'Information Posts Fetch Successful', result: information };
    } catch (e) {
      console.error('Failed fetching all information posts:', e);
      return { message: 'Failed fetching all information posts', result: null };
    }
  }

  async addUser(user: User){
    const newUser = {
      userid: user.userID,
      username: user.userName,
      address: user.address,
      dateofbirth: user.dateOfBirth,
      gender: user.gender,
      profileimage: user.profileImage,
      maskednumber: user.maskedNumber, 
      email: user.email,
      phone: user.phone,
      password: user.password,
      language: user.language
    };
    try {
      await axios.post(`${this.baseUrl}/users`, newUser, { headers: this.headers });
      console.log('User sign up successful');
      return { message: 'User sign up successful' };
    } catch (e) {
      console.error('Failed: User sign up', e);
      return { message: 'Failed: User sign up' };
    }
  }

  async getUser(email: string, password: string){
    try{
      const query: string= `SELECT * from ${TABLES.mainUsers} WHERE email = '${email}' ALLOW FILTERING;`
      const headers = {
        'Content-Type': 'text/plain',
        'X-Cassandra-Token': ASTRA_DB_APPLICATION_TOKEN,
      }
      let response = await axios.post(`${ASTRA_BASE_URL}/api/rest/v2/cql?keyspaceQP=${ASTRA_DB_KEYSPACE}`, query, {headers})
      const userData = response.data.data[0]
      if(userData.password === password) return { message: 'Valid User', user: userData}
      else return { message: 'Invalid Credentials. Please try again.', user: null}
    }catch(e){
      console.error('User not found', e);
      return {message: 'Invalid Credentials. Please try again.', user: null}
    }

  }
}
