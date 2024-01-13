// require("dotenv").config()   // disturbs the consistency of code , but adopting import one brings changes in json dev script, 
import dotenv from "dotenv"; 
import mongoose from "mongoose";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./env"
});  // load environment variables as early as possible

connectDB();















// IIFE version of DB connection ,  used try catch while connecting DB to handle error   ,  always use async-await while connecting DB because it is a time taking process as DB are in different continent

// GOOD code we didn't pollute any thing as put all code inside IIFE, but index.js i spolluted with DB connection code

/*
const app=express();

;(async()=>{
 try{
  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
  app.on("Error",(error)=>{
    console.log("Express Server Error: ",error);
    throw error;
  })

  app.listen(process.env.PORT,()=>{
    console.log(`Express Server is running on port ${process.env.PORT}`);
  })

 }catch(error){
  console.log("Mongoose Connection Error: ",error);
  throw error;
 }
})()
*/