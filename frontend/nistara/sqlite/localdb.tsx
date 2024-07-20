import * as SQLite from 'expo-sqlite';
import { sha256 } from 'js-sha256';

export enum TABLES{
    mainPosts = "posts",
    mainRequests = "requests",
    mainDonations = "donations",
    mainMatches = "matches"
};

export interface Post {
    id: string;
    geolocation: [number, number];
    multimediaurl: string[];
    textcontent: string;
    timestamp: string;
    lastupdatetimestamp: string;
    userid: string;
    username: string;
    profilephoto: string;
    language: string;
    classifier: number;
    isclassified: boolean;
    class: string|null;
    translator:number;
    istranslated:boolean;
    translatedtextcontent:string|null
    mesh?:boolean;
}

export interface Request {
    id: string;
    geolocation: [number, number];
    ismatched: number;
    item: string;
    matcherid: number;
    postclass: string;
    postid: string;
    profilephoto: string;
    quantity: number;
    timestamp: number;
    translatedtextcontent: string;
    umbrellatype: string;
    userid: string;
    username: string;
}

export class SQLiteClient{
    db: SQLite.SQLiteDatabase;

    // on initialization of client object db is initialized and table posts is created
    constructor() {
        this.db = SQLite.openDatabaseSync('nistara.db');
    }

    async addPost(post: Post, mesh: boolean){
        await this.db.runAsync(
            `INSERT INTO posts (id, geolocation, multimediaurl, textcontent,
            timestamp, lastupdatetimestamp, userid, username, profilephoto, language, classifier, isclassified, class,
            translator, istranslated, translatedtextcontent, mesh) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) `,
           [post.id,
            JSON.stringify(post.geolocation),
            JSON.stringify(post.multimediaurl),
            post.textcontent,
            post.timestamp,
            post.lastupdatetimestamp,
            post.userid,
            post.username,
            post.profilephoto,
            post.language,
            post.classifier,
            post.isclassified? 1: 0,
            post.class,
            post.translator,
            post.istranslated? 1: 0,
            post.translatedtextcontent,
            mesh? 1: 0
           ]
        )
        console.log("added post successfully")
    }

    async writePost(userid: string, username: string, profilephoto:string, textcontent: string, multimediaurl: string[], timestamp: string, geoLocation: [number, number], language:string, mesh: boolean){
        let postid: string = sha256(String(userid) + textcontent + String(multimediaurl) + timestamp + String(geoLocation)).toString();
        let data: Post = {
            id: postid,
            geolocation: geoLocation,
            multimediaurl,
            textcontent,
            timestamp: timestamp,
            lastupdatetimestamp: timestamp,
            userid,
            username,
            profilephoto,
            language,
            classifier: -1,
            isclassified: false,
            class: null,
            translator: -1,
            istranslated: (language === 'eng_Latn' || language === 'en') ? true : false,
            translatedtextcontent: (language === 'eng_Latn' || language === 'en') ? textcontent : null,
            mesh
        };

        await this.addPost(data, mesh)
    }


    async updatePost(post: Post){
        await this.db.runAsync(
            `UPDATE posts SET
            lastupdatetimestamp = ?,
            classifier = ?,
            isclassified = ?,
            class = ?,
            translator = ?,
            istranslated = ?,
            translatedtextcontent = ?
            WHERE postid = ?`,
            [
                post.lastupdatetimestamp,
                post.classifier,
                post.isclassified? 1: 0,
                post.class,
                post.translator,
                post.istranslated? 1: 0,
                post.translatedtextcontent,
                post.id
            ]
        )
    }


    async getPosts():Promise<Post[]>{
        // retrieve all posts from the sqlite db on local, and return as array of json objects
        // return in format compatible with screens -- geolocation and multimediaurl as lists 
        const allPosts = await this.db.getAllAsync('SELECT * from posts');
        let posts = allPosts.map((post: any)=>{
            let typedpost : Post = {
                id: post.id,
                geolocation: JSON.parse(post.geolocation),
                multimediaurl: JSON.parse(post.multimediaurl),
                textcontent: post.textcontent,
                timestamp: post.timestamp,
                lastupdatetimestamp: post.lastupdatetimestamp,
                userid: post.userid,
                username: post.username,
                profilephoto: post.profilephoto,
                language: post.language,
                classifier: post.classifier,
                isclassified: (post.isclassified==1)? true: false,
                class: post.class,
                translator: post.translator,
                istranslated: (post.istranslated==1)? true: false,
                translatedtextcontent: post.translatedtextcontent,
                mesh:(post.mesh==1)?true:false
            }
            return typedpost
        })

        return posts
    }

    async validateAddAndUpdatePosts(posts: Post[], mesh: boolean){
        // retrieve all posts from sqlite 
        // for each post in posts, check if present in sqlite by postid
        // if not present insert into sqlite directly
        // if present, check if lastupdatedtimestamp is different from postsCloudDb
        // if different update
        // if not different, continue
        // repeat till all posts are parsed
    try{
        const postsLocal = await this.getPosts();
        if(postsLocal.length==0){
            // add all posts received 
            posts.map(async(post:Post)=>{
                await this.addPost(post, mesh)
            })
        }else{
            // every local posts with post id
            const localPostsMap = new Map(postsLocal.map((post: Post) => [post.id, post]));

            for(const post of posts){
                const localPost = localPostsMap.get(post.id) // check if given post in sqlite
                
                if(!localPost){
                    await this.addPost(post, mesh)
                }else{
                    // post is present in local, see if it is updated
                    if(localPost.lastupdatetimestamp !== post.lastupdatetimestamp){
                        await this.updatePost(post) // if updated, update in local as well
                    }
                }
            }
        }
    }catch(error){
        console.error(error)
    }     
    }

    async clearPostsTable(){
        await this.db.execAsync(`DELETE FROM posts`);
        await this.db.execAsync('VACUUM');
        console.log("All rows deleted successfully");
    }

    static async initDatabase(db: SQLite.SQLiteDatabase){
        await db.execAsync(`CREATE TABLE IF NOT EXISTS ${TABLES.mainPosts} (
          id TEXT PRIMARY KEY,
          geolocation TEXT,
          multimediaurl TEXT,
          textcontent TEXT,
          timestamp TEXT,
          lastupdatetimestamp TEXT,
          userid TEXT,
          username TEXT,
          profilephoto TEXT,
          language TEXT,
          classifier INTEGER,
          isclassified INTEGER,
          class TEXT,
          translator INTEGER,
          istranslated INTEGER,
          translatedtextcontent TEXT,
          mesh INTEGER
        )`)
    
        await db.execAsync(`CREATE TABLE IF NOT EXISTS ${TABLES.mainRequests} (
          id TEXT PRIMARY KEY,
          geolocation TEXT,
          ismatched INTEGER,
          item TEXT,
          matcherid INTEGER,
          postclass TEXT,
          postid TEXT,
          profilephoto TEXT,
          quantity INTEGER,
          timestamp TEXT,
          translatedtextcontent TEXT,
          umbrellatype TEXT,
          userid TEXT,
          username TEXT   
        )`)
    
        await db.execAsync(`CREATE TABLE IF NOT EXISTS ${TABLES.mainDonations}(
          id TEXT PRIMARY KEY,
          geolocation TEXT,
          ismatched INTEGER,
          item TEXT,
          matcherid INTEGER,
          postclass TEXT,
          postid TEXT,
          profilephoto TEXT,
          quantity INTEGER,
          timestamp TEXT,
          translatedtextcontent TEXT,
          umbrellatype TEXT,
          userid TEXT,
          username TEXT 
        )`)
    
        await db.execAsync(`CREATE TABLE IF NOT EXISTS ${TABLES.mainMatches}(
          requestid TEXT,
          donationid TEXT,
          donorack INTEGER,
          matcherid INTEGER,
          matchtime TEXT,
          requesterack INTEGER,
          PRIMARY KEY (requestid, donationid)
        )`)
    console.log("Tables created successfully")
    }
}