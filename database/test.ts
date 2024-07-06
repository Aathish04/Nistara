import {dbClient} from "./database.js"

let db : dbClient = new dbClient();
let res= await db.addPost(1,"trial",[],1720263740389,[0,0])
console.log(res)

let res2 = await db.getPosts();
console.log(res2)
