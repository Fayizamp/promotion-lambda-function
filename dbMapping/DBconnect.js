import mongoose from 'mongoose';
import dotenv from 'dotenv';
// const dotenv =require('dotenv');

dotenv.config()
const connection ={}

export default async function connectDB(projectName){
   if(!projectName){
    throw new Error("Project name is required");
   }
   const baseUri = process.env.MONGO_URI.endsWith('/') 
   ? process.env.MONGO_URI 
   : `${process.env.MONGO_URI}/`;
 
 const db = `${baseUri}${projectName}?retryWrites=true&w=majority`;
//  const db = `${process.env.MONGO_URI}${projectName}?retryWrites=true&w=majority`

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