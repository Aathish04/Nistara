import axios from 'axios';
import { sha256 } from 'js-sha256';
import { Credential } from './env';

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

  async addPost(userID: number, textualInfo: string, multimediaURL: string[], timestamp: number, geoLocation: [number, number]) {
    let postID: string = sha256(String(userID) + textualInfo + String(multimediaURL) + timestamp + String(geoLocation));
    const payload = {
      postID,
      userID,
      textualInfo,
      multimediaURL,
      timestamp,
      geoLocation,
      classifier: -1,
      isClassified: false,
    };

    try {
      await axios.post(`${this.baseUrl}/posts`, payload, { headers: this.headers });
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
      console.log(response)
      const posts = response.data.data.map((post: any) => ({
        postID: post.postid,
        userID: post.userid,
        textualInfo: post.textualinfo,
        multimediaURL: post.multimediaurl,
        timestamp: post.timestamp,
        geoLocation: post.geolocation,
        classifier: post.classifier,
        isClassified: post.isclassified,
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
      return { message: 'Post Fetch Successful', result: response.data.rows };
    } catch (e) {
      console.error('Failed fetching all posts:', e);
      return { message: 'Failed fetching all posts' };
    }
  }

  async getDonationPosts() {
    try {
      let response = await axios.get(`${this.baseUrl}/donations/rows`, { headers: this.headers });
      return { message: 'Post Fetch Successful', result: response.data.rows };
    } catch (e) {
      console.error('Failed fetching all posts:', e);
      return { message: 'Failed fetching all posts' };
    }
  }

  async getInformationPosts() {
    try {
      let response = await axios.get(`${this.baseUrl}/information/rows`, { headers: this.headers });
      return { message: 'Post Fetch Successful', result: response.data.rows };
    } catch (e) {
      console.error('Failed fetching all posts:', e);
      return { message: 'Failed fetching all posts' };
    }
  }
}
