import {dbClient} from "./database.js"

let db : dbClient = new dbClient();
let res= await db.addPost(1,"trial",[],1720263740389,[0,0])
console.log(res)

console.log("Posts")
let res2 = await db.getPosts();
console.log(res2)

console.log("Requests")
let res3 = await db.getRequestPosts();
console.log(res3)

console.log("Donations")
let res4 = await db.getDonationPosts();
console.log(res4)


console.log("Information")
let res5 = await db.getInformationPosts();
console.log(res5)