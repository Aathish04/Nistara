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
    ismatched: boolean;
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

export interface Donation {
    id: string;
    geolocation: [number, number];
    ismatched: boolean;
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

export interface Match {
    requestid :string,
    donationid : string,
    donorack : boolean,
    matcherid : number,
    matchtime : string,
    requesterack : boolean,
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

    

        // Add Request
    async addRequest(request: Request) {
        await this.db.runAsync(
            `INSERT INTO ${TABLES.mainRequests} (id, geolocation, ismatched, item, matcherid, postclass, postid, profilephoto, quantity, timestamp, translatedtextcontent, umbrellatype, userid, username) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                request.id,
                JSON.stringify(request.geolocation),
                request.ismatched ? 1 : 0,
                request.item,
                request.matcherid,
                request.postclass,
                request.postid,
                request.profilephoto,
                request.quantity,
                request.timestamp,
                request.translatedtextcontent,
                request.umbrellatype,
                request.userid,
                request.username
            ]
        );
        console.log("Added request successfully");
    }

    // Update Request
    async updateRequest(request: Request) {
        await this.db.runAsync(
            `UPDATE ${TABLES.mainRequests} SET 
            geolocation = ?, 
            ismatched = ?, 
            item = ?, 
            matcherid = ?, 
            postclass = ?, 
            postid = ?, 
            profilephoto = ?, 
            quantity = ?, 
            timestamp = ?, 
            translatedtextcontent = ?, 
            umbrellatype = ?, 
            userid = ?, 
            username = ? 
            WHERE id = ?`,
            [
                JSON.stringify(request.geolocation),
                request.ismatched ? 1 : 0,
                request.item,
                request.matcherid,
                request.postclass,
                request.postid,
                request.profilephoto,
                request.quantity,
                request.timestamp,
                request.translatedtextcontent,
                request.umbrellatype,
                request.userid,
                request.username,
                request.id
            ]
        );
    }

    // Get Requests
    async getRequests(): Promise<Request[]> {
        const allRequests = await this.db.getAllAsync(`SELECT * FROM ${TABLES.mainRequests}`);
        let requests = allRequests.map((request: any) => {
            let typedRequest: Request = {
                id: request.id,
                geolocation: JSON.parse(request.geolocation),
                ismatched: request.ismatched == 1,
                item: request.item,
                matcherid: request.matcherid,
                postclass: request.postclass,
                postid: request.postid,
                profilephoto: request.profilephoto,
                quantity: request.quantity,
                timestamp: request.timestamp,
                translatedtextcontent: request.translatedtextcontent,
                umbrellatype: request.umbrellatype,
                userid: request.userid,
                username: request.username
            };
            return typedRequest;
        });
        return requests;
    }

    // Validate and Add or Update Requests
    async validateAddAndUpdateRequests(requests: Request[]) {
        try {
            const requestsLocal = await this.getRequests();
            if (requestsLocal.length == 0) {
                requests.map(async (request: Request) => {
                    await this.addRequest(request);
                });
            } else {
                const localRequestsMap = new Map(requestsLocal.map((request: Request) => [request.id, request]));

                for (const request of requests) {
                    const localRequest = localRequestsMap.get(request.id);

                    if (!localRequest) {
                        await this.addRequest(request);
                    } else {
                        if (localRequest.timestamp !== request.timestamp) {
                            await this.updateRequest(request);
                        }
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    // Clear Requests Table
    async clearRequestsTable() {
        await this.db.execAsync(`DELETE FROM ${TABLES.mainRequests}`);
        await this.db.execAsync('VACUUM');
        console.log("All rows deleted successfully");
    }

    // Add Donation
    async addDonation(donation: Donation) {
        await this.db.runAsync(
            `INSERT INTO ${TABLES.mainDonations} (id, geolocation, ismatched, item, matcherid, postclass, postid, profilephoto, quantity, timestamp, translatedtextcontent, umbrellatype, userid, username) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                donation.id,
                JSON.stringify(donation.geolocation),
                donation.ismatched ? 1 : 0,
                donation.item,
                donation.matcherid,
                donation.postclass,
                donation.postid,
                donation.profilephoto,
                donation.quantity,
                donation.timestamp,
                donation.translatedtextcontent,
                donation.umbrellatype,
                donation.userid,
                donation.username
            ]
        );
        console.log("Added donation successfully");
    }

    // Update Donation
    async updateDonation(donation: Donation) {
        await this.db.runAsync(
            `UPDATE ${TABLES.mainDonations} SET 
            geolocation = ?, 
            ismatched = ?, 
            item = ?, 
            matcherid = ?, 
            postclass = ?, 
            postid = ?, 
            profilephoto = ?, 
            quantity = ?, 
            timestamp = ?, 
            translatedtextcontent = ?, 
            umbrellatype = ?, 
            userid = ?, 
            username = ? 
            WHERE id = ?`,
            [
                JSON.stringify(donation.geolocation),
                donation.ismatched ? 1 : 0,
                donation.item,
                donation.matcherid,
                donation.postclass,
                donation.postid,
                donation.profilephoto,
                donation.quantity,
                donation.timestamp,
                donation.translatedtextcontent,
                donation.umbrellatype,
                donation.userid,
                donation.username,
                donation.id
            ]
        );
    }

    // Get Donations
    async getDonations(): Promise<Donation[]> {
        const allDonations = await this.db.getAllAsync(`SELECT * FROM ${TABLES.mainDonations}`);
        let donations = allDonations.map((donation: any) => {
            let typedDonation: Donation = {
                id: donation.id,
                geolocation: JSON.parse(donation.geolocation),
                ismatched: donation.ismatched == 1,
                item: donation.item,
                matcherid: donation.matcherid,
                postclass: donation.postclass,
                postid: donation.postid,
                profilephoto: donation.profilephoto,
                quantity: donation.quantity,
                timestamp: donation.timestamp,
                translatedtextcontent: donation.translatedtextcontent,
                umbrellatype: donation.umbrellatype,
                userid: donation.userid,
                username: donation.username
            };
            return typedDonation;
        });
        return donations;
    }

    // Validate and Add or Update Donations
    async validateAddAndUpdateDonations(donations: Donation[]) {
        try {
            const donationsLocal = await this.getDonations();
            if (donationsLocal.length == 0) {
                donations.map(async (donation: Donation) => {
                    await this.addDonation(donation);
                });
            } else {
                const localDonationsMap = new Map(donationsLocal.map((donation: Donation) => [donation.id, donation]));

                for (const donation of donations) {
                    const localDonation = localDonationsMap.get(donation.id);

                    if (!localDonation) {
                        await this.addDonation(donation);
                    } else {
                        if (localDonation.timestamp !== donation.timestamp) {
                            await this.updateDonation(donation);
                        }
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    // Clear Donations Table
    async clearDonationsTable() {
        await this.db.execAsync(`DELETE FROM ${TABLES.mainDonations}`);
        await this.db.execAsync('VACUUM');
        console.log("All rows deleted successfully");
    }

    // Add Match
    async addMatch(match: Match) {
        await this.db.runAsync(
            `INSERT INTO ${TABLES.mainMatches} (requestid, donationid, donorack, matcherid, matchtime, requesterack) VALUES (
            ?, ?, ?, ?, ?, ?)`,
            [
                match.requestid,
                match.donationid,
                match.donorack ? 1 : 0,
                match.matcherid,
                match.matchtime,
                match.requesterack ? 1 : 0
            ]
        );
        console.log("Added match successfully");
    }

    // Update Match
    async updateMatch(match: Match) {
        await this.db.runAsync(
            `UPDATE ${TABLES.mainMatches} SET 
            donorack = ?, 
            matcherid = ?, 
            matchtime = ?, 
            requesterack = ? 
            WHERE requestid = ? AND donationid = ?`,
            [
                match.donorack ? 1 : 0,
                match.matcherid,
                match.matchtime,
                match.requesterack ? 1 : 0,
                match.requestid,
                match.donationid
            ]
        );
    }

    // Get Matches
    async getMatches(): Promise<Match[]> {
        const allMatches = await this.db.getAllAsync(`SELECT * FROM ${TABLES.mainMatches}`);
        let matches = allMatches.map((match: any) => {
            let typedMatch: Match = {
                requestid: match.requestid,
                donationid: match.donationid,
                donorack: match.donorack == 1,
                matcherid: match.matcherid,
                matchtime: match.matchtime,
                requesterack: match.requesterack == 1
            };
            return typedMatch;
        });
        return matches;
    }

    // Validate and Add or Update Matches
    async validateAddAndUpdateMatches(matches: Match[]) {
        try {
            const matchesLocal = await this.getMatches();
            if (matchesLocal.length == 0) {
                matches.map(async (match: Match) => {
                    await this.addMatch(match);
                });
            } else {
                const localMatchesMap = new Map(matchesLocal.map((match: Match) => [match.requestid + match.donationid, match]));

                for (const match of matches) {
                    const localMatch = localMatchesMap.get(match.requestid + match.donationid);

                    if (!localMatch) {
                        await this.addMatch(match);
                    } else {
                        if (localMatch.matchtime !== match.matchtime) {
                            await this.updateMatch(match);
                        }
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    // Clear Matches Table
    async clearMatchesTable() {
        await this.db.execAsync(`DELETE FROM ${TABLES.mainMatches}`);
        await this.db.execAsync('VACUUM');
        console.log("All rows deleted successfully");
    }

    // Get Posts given userid
    async getPostsWhereUserId(userid: string){
        const userPosts = await this.db.getAllAsync(`SELECT * from ${TABLES.mainPosts} WHERE userid = ?`, [userid])
        let posts = userPosts.map((post: any)=>{
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

    // Get Requests given userid
    async getRequestsWhereUserId(userid: string){
        const userRequests = await this.db.getAllAsync(`SELECT * from ${TABLES.mainRequests} WHERE userid = ?`, [userid])
        let requests = userRequests.map((request: any) => {
            let typedRequest: Request = {
                id: request.id,
                geolocation: JSON.parse(request.geolocation),
                ismatched: request.ismatched == 1,
                item: request.item,
                matcherid: request.matcherid,
                postclass: request.postclass,
                postid: request.postid,
                profilephoto: request.profilephoto,
                quantity: request.quantity,
                timestamp: request.timestamp,
                translatedtextcontent: request.translatedtextcontent,
                umbrellatype: request.umbrellatype,
                userid: request.userid,
                username: request.username
            };
            return typedRequest;
        });
        return requests;
    }

    async getPostsWherePostId(id: string){
        const post : any = await this.db.getFirstAsync(`SELECT * from ${TABLES.mainPosts} WHERE id = ?`, [id])
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
    }

    // Get Donations given userid
    async getDonationsWhereUserId(userid: string){
        const userDonations = await this.db.getAllAsync(`SELECT * from ${TABLES.mainDonations} WHERE userid = ?`, [userid])
        let donations = userDonations.map((donation: any) => {
            let typedDonation: Donation = {
                id: donation.id,
                geolocation: JSON.parse(donation.geolocation),
                ismatched: donation.ismatched == 1,
                item: donation.item,
                matcherid: donation.matcherid,
                postclass: donation.postclass,
                postid: donation.postid,
                profilephoto: donation.profilephoto,
                quantity: donation.quantity,
                timestamp: donation.timestamp,
                translatedtextcontent: donation.translatedtextcontent,
                umbrellatype: donation.umbrellatype,
                userid: donation.userid,
                username: donation.username
            };
            return typedDonation;
        });
        return donations;
    }

    // Get Request Items given postid
    async getRequestItemsWherePostId(postid: string){
        const postRequests = await this.db.getAllAsync(`SELECT * from ${TABLES.mainRequests} WHERE postid = ?`, [postid])
        let requestItems: string[] = []
        postRequests.map((request: any) => {
            requestItems.push(request.item)
        });
        return requestItems;
    }

    // Get Request - Suppy/ Demand Analytics
    async getRequestCounts(){
        const postclassQuery = `
            SELECT postclass, COUNT(*) AS count, SUM(ismatched) AS matched_count
            FROM ${TABLES.mainRequests}
            GROUP BY postclass
            `;

        const umbrellatypeQuery = `
            SELECT umbrellatype, COUNT(*) AS count, SUM(ismatched) AS matched_count
            FROM ${TABLES.mainRequests}
            GROUP BY umbrellatype
          `;

        const postclassRequests: any = await this.db.getAllAsync(postclassQuery);
        const umbrellatypeRequests: any = await this.db.getAllAsync(umbrellatypeQuery)

        const postclassData = postclassRequests.reduce((acc: { [x: string]: { count: any; matched_count: any; }; }, row: { postclass: string | number; count: any; matched_count: any; }) => {
            acc[row.postclass] = {
              count: row.count,
              matched_count: row.matched_count
            };
            return acc;
          }, {});
      
          const umbrellatypeData = umbrellatypeRequests.reduce((acc: { [x: string]: { count: any; matched_count: any; }; }, row: { umbrellatype: string | number; count: any; matched_count: any; }) => {
            acc[row.umbrellatype] = {
              count: row.count,
              matched_count: row.matched_count
            };
            return acc;
          }, {});

          return {postclassData, umbrellatypeData}
    }

    async searchPosts(searchQuery: string){
        const requiredPosts: any| null = await this.db.getAllAsync(`SELECT * from ${TABLES.mainPosts} where translatedtextcontent LIKE ?`, [`%${searchQuery}%`])
        if(requiredPosts && requiredPosts.length>0) return requiredPosts
        else return null
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

    async clearAllTables(){
        await this.db.execAsync(`DELETE FROM ${TABLES.mainPosts}`);
        await this.db.execAsync(`DELETE FROM ${TABLES.mainRequests}`);
        await this.db.execAsync(`DELETE FROM ${TABLES.mainDonations}`);
        await this.db.execAsync(`DELETE FROM ${TABLES.mainMatches}`)
        await this.db.execAsync('VACUUM');
        console.log("All tables cleared successfully");
    }
}