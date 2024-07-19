import * as SQLite from 'expo-sqlite';
import { sha256 } from 'js-sha256';

export class SQLiteClient{
    db: any;

    // on initialization of client object db is initialized and table posts is created
    constructor() {
        this.db = SQLite.openDatabaseSync('nistara.db');
    }

    // not used or called anywhere
    async createTable() {
        await this.db.execAsync(`CREATE TABLE IF NOT EXISTS posts (
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
        console.log("created successfully")
    }

    async addPost(post: any, mesh: boolean){
        console.log(post)
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

    async writePost(userid: string, username: string, profilephoto:string, textcontent: string, multimediaurl: string[], timestamp: number, geoLocation: [number, number], language:string, mesh: boolean){
        let postid: string = sha256(String(userid) + textcontent + String(multimediaurl) + timestamp + String(geoLocation)).toString();
        let data: any;

        data = {
        id: postid,
        geolocation: geoLocation,
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
        if(language=='eng_Latn' || language=='en'){
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

        console.log(payload)
        console.log(mesh)

        await this.addPost(payload, mesh)
    }


    async updatePost(post: any){
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
                post.postid
            ]
        )
    }

    
    async getPosts(){
        // retrieve all posts from the sqlite db on local, and return as array of json objects
        // return in format compatible with screens -- geolocation and multimediaurl as lists 
        const allPosts = await this.db.getAllAsync('SELECT * from posts');
        let posts;
        if(allPosts.length>0){
           posts = allPosts.map((post: any)=>({
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
                    translatedtextcontent: post.translatedtextcontent
                }))
            return {message: 'Posts retrieval successful', result: posts}
        }else return {message: 'No posts to retrieve', result: null}
        
    }

    async validateAddAndUpdatePosts(posts: any[], mesh: boolean){
        // retrieve all posts from sqlite 
        // for each post in posts, check if present in sqlite by postid
        // if not present insert into sqlite directly
        // if present, check if lastupdatedtimestamp is different from postsCloudDb
        // if different update
        // if not different, continue
        // repeat till all posts are parsed
    try{
        const response = await this.getPosts();
        const postsLocal: any[] | null = response.result
        if(postsLocal==null || postsLocal.length==0){
            // add all posts received 
            posts.map(async(post:any)=>{
                await this.addPost(post, mesh)
            })
        }else{
            // every local posts with post id
            const localPostsMap = new Map(postsLocal.map((post: any) => [post.id, post]));

            for(const post of posts){
                const localPost = localPostsMap.get(post.id) // check if given post in sqlite
                
                if(!localPost){
                    await this.addPost(post, mesh)
                }else{
                    // post is present in local, see if it is updated
                    if(localPost.lastupdatedtimestamp !== post.lastupdatedtimestamp){
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
        console.log("All rows deleted successfully");
    }
    
}