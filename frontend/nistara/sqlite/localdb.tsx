import * as SQLite from 'expo-sqlite';

export class SQLiteClient{
    db: any;

    // on initialization of client object db is initialized and table posts is created
    constructor() {
        this.db = SQLite.openDatabaseSync('nistara.db');
    }

    async createTable() {
        console.log("hello world")
        await this.db.execAsync(`CREATE TABLE IF NOT EXISTS posts (
            postid TEXT PRIMARY KEY,
            geolocation_lat REAL,
            geolocation_long REAL,
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
            translatedtextcontent TEXT
        )`)
        console.log("created successfully")
    }

    async insertPost(post: any, mesh: boolean){
        await this.db.runAsync(
            `INSERT INTO posts (postid, geolocation_lat, geolocation_long, multimediaurl, textcontent,
            timestamp, lastupdatetimestamp, userid, username, profilephoto, language, classifier, isclassified, class,
            translator, istranslated, translatedtextcontent, mesh) VALUES `,
           [post.postid,
            post.geolocation[0],
            post.geolocation[1],
            JSON.stringify(post.multimediaurl),
            post.textcontent,
            post.timestamp,
            post.lastupdatetimestamp,
            post.userid,
            post.username,
            post.profilephoto,
            post.language,
            post.classifier,
            post.isclassified,
            post.class,
            post.translator,
            post.istranslated,
            post.translatedtextcontent,
            mesh
           ]
        )
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
                post.isclassified,
                post.class,
                post.translator,
                post.istranslated,
                post.translatedtextcontent,
                post.postid
            ]
        )
    }

    async insertPostsFromCloudDb(postsCloudDb: any){
        // retrieve all posts from sqlite 
        // for each post in postsCloudDb, check if present in sqlite by postid
        // if not present insert into sqlite directly
        // if present, check if lastupdatedtimestamp is different from postsCloudDb
        // if different update
        // if not different, continue
        // repeat till all posts are parsed

        
    }

    async getAllPosts(){
        // retrieve all posts from the sqlite db on local, and return as array of json objects
        // return in format compatible with screens -- geolocation and multimediaurl as lists 
        const allPosts = await this.db.getAllAsync('SELECT * from posts');
        console.log(allPosts)
    }

}