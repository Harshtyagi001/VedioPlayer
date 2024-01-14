import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({
   cloud_name: process.env.CLOUDINARY_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET
});

// cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" }, 
//   function(error, result) {console.log(result); });


// Turning above function to try catch form with my required customizations
const uploadOnCloudinary=async(localFilePath)=>{
  try{
    if(!localFilePath)return null;
      const response=await cloudinary.uploader.upload(localFilePath,{
      resource_type: "auto"     // to automatically identify the file type(audio,vedio,pdf) by cloudinary
     })
     console.log("File is Uploaded Successfully on Cloudinary", response.url);
     return response;
  }catch(error){
    fs.unlinkSync(localFilePath)   // If there is an error in uploading, remove the locally saved temporary file (definitely I don't want to fill space with corrupt data)
    return null; 
  }
}

export default uploadOnCloudinary;