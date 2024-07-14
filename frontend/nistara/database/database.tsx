import axios from 'axios';
import { sha256 } from 'js-sha256';
import { Credential } from './env';

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
  password: string
}

const cred = new Credential();
const ASTRA_DB_ID :string = cred.ASTRA_DB_ID
const ASTRA_DB_REGION : string = cred.ASTRA_DB_REGION
const ASTRA_DB_KEYSPACE : string = cred.ASTRA_DB_KEYSPACE
const ASTRA_DB_APPLICATION_TOKEN : string = cred.ASTRA_DB_APPLICATION_TOKEN

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

  async addPost(userID: string, username: string, textualInfo: string, multimediaURL: string[], timestamp: number, geoLocation: [number, number]) {
    let postID: string = sha256(String(userID) + textualInfo + String(multimediaURL) + timestamp + String(geoLocation)).toString();
    const geoLocationStr = `(${geoLocation[0]},${geoLocation[1]})`
    console.log(geoLocationStr)
    const data = {
      postid: postID,
      userid: userID,
      username: username,
      profilephoto: null,
      textualinfo: textualInfo,
      multimediaurl: multimediaURL,
      timestamp : timestamp,
      geolocation: geoLocationStr,
      classifier: -1,
      isclassified: false,
      tag:null
    };
    try {
      await axios.post(`${this.baseUrl}/posts`, data, { headers: this.headers });
      console.log('Post added successfully');
      return { message: 'Post Added Successfully' };
    } catch (e) {
      console.error('Failed Adding Post:', e);
      return { message: 'Failed Adding Post' };
    }
  }

  async getPosts() {
    try {
      let response = await axios.get(`${this.baseUrl}/posts/rows`, { headers: this.headers });
      const posts = response.data.data.map((post: any) => ({
        postid: post.postid,
        userid: post.userid,
        textualinfo: post.textualinfo,
        multimediaurl: post.multimediaurl,
        timestamp: post.timestamp,
        geolocation: post.geolocation,
        classifier: post.classifier,
        isclassified: post.isclassified,
        profilephoto: post.profilephoto,
        tag: post.tag,
        username: post.username

      }));
      return { message: 'Post Fetch Successful', result: posts };
    } catch (e) {
      console.error('Failed fetching all posts:', e);
      return { message: 'Failed fetching all posts' };
    }
  }

  async getRequestPosts() {
    try {
      let response = await axios.get(`${this.baseUrl}/requests/rows`, { headers: this.headers });
      const requests = response.data.data.map((request: any)=>({
        postID: request.postid,
        requestID: request.requestid,
        requestType: request.requesttype,
        item: request.item,
        quantity: request.quantity,
        class: request.class,
        userID: request.userid,
        geoLocation: request.geoLocation,
        isComplete: request.iscomplete
      }))
      return { message: 'Request Posts Fetch Successful', result: requests};
    } catch (e) {
      console.error('Failed fetching all request posts:', e);
      return { message: 'Failed fetching all request posts' };
    }
  }

  async getDonationPosts() {
    try {
      let response = await axios.get(`${this.baseUrl}/donations/rows`, { headers: this.headers });
      const donations = response.data.data.map((donation:any)=>({
        postID: donation.postid,
        donationID: donation.donationid,
        donatingItem: donation.donatingitem,
        quantity: donation.quantity,
        geoLocation: donation.geolocation,
        isComplete: donation.iscomplete,
        userID: donation.userid
      }))
      return { message: 'Donation Posts Fetch Successful', result: donations };
    } catch (e) {
      console.error('Failed fetching all donation posts:', e);
      return { message: 'Failed fetching all donation posts' };
    }
  }

  async getInformationPosts() {
    try {
      let response = await axios.get(`${this.baseUrl}/information/rows`, { headers: this.headers });
      const information = response.data.data.map((info: any)=>({
        postID: info.postid,
        userID: info.userid,
        textualInfo: info.textualinfo,
        multimediaURL: info.multimediaURL,
        geoLocation: info.geolocation
      }))
      return { message: 'Information Posts Fetch Successful', result: information };
    } catch (e) {
      console.error('Failed fetching all information posts:', e);
      return { message: 'Failed fetching all information posts' };
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
      password: user.password
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
}
