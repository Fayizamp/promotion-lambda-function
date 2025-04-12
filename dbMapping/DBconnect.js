const mongoose = require('mongoose')
const dotenv =require('dotenv');

dotenv.config()
const connection ={}

export default async function connectDB(projectName){
   if(!projectName){
    return res.json({ error: "project ame is required" });
   }

   const db = `${process.env.MONGO_URI}${projectName}?retryWrites=true&w=majority`

   if(connection[projectName]){
    return connection[projectName]
   }
   const conn = await mongoose.createConnection(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).asPromise();

   connection[projectName] == conn;
   return conn;
}