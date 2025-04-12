import mongoose from 'mongoose';
import dotenv from 'dotenv';
// const dotenv =require('dotenv');

dotenv.config()
const connection ={}

export default async function connectDB(projectName){
   if(!projectName){
    throw new Error("Project name is required");
   }

   const db = `${process.env.MONGO_URI}${projectName}?retryWrites=true&w=majority`
//    console.log(db);
   

   if(connection[projectName]){
    return connection[projectName]
   }
   const conn = await mongoose.createConnection(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).asPromise();

   connection[projectName] = conn;
   return conn;
}