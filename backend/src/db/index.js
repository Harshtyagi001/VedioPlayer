import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';


const connectDB = async()=>{
 try{
   const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
   console.log(`MongoDB Connection Successful!!! DB_HOST: ${connectionInstance.connection.host}`);
 }catch(error){
  console.log("MongoDB Connection Error: ",error);
  process.exit(1);   // 1 means exit with failure
 }
} 

export default connectDB;