import asyncHandler from './../utils/assyncHandler.js';
import ApiError from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import uploadOnCloudinary from '../utils/cloudinary.js';
import ApiResponse from './../utils/ApiResponse.js';


const registerUser=asyncHandler(async (req,res)=>{
  // get user details from frontend
  // validation on fields
  // check if already exits
  // check for images, check for avatar
  // if images are there then upload them to cloudinary
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return response if creation is successful

  console.log("request",req.body);
  const {username,fullName,email,password}=req.body;
  // Advance syntax for checking all fields
  if ([username,fullName,email,password].some((field)=>{
    return field.trim()===""             // returns true if any field is empty
  })){
    throw new ApiError(400, "All fields are required")
  }

  // check if already exists
  const existedUser=await User.findOne({
    $or: [ {username} , {email}]      // Dono me se koi sa bhi mil jae
  })
  // console.log("ExistedUser: ",existedUser)
   if(existedUser!=null){
    throw new ApiError(409,"User with username or email already exists")
   }
  
   const avatarLocalPath=req.files?.avatar[0]?.path;
   const coverImageLocalPath=req.files?.coverImage[0]?.path;
   console.log("CoverImage: ",coverImageLocalPath)
   if(!avatarLocalPath) throw new ApiError(400,"Avatar file is required");

  const avatar=  await uploadOnCloudinary(avatarLocalPath);
  const coverImage= await uploadOnCloudinary(coverImageLocalPath);

  if(!avatar)throw new ApiError(400,"Avatar file is required, issue while uploading on cloudinary")

  // If all set then create entry in Database

  const user = await User.create({
    username,
    email,
    password,
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",

  })
  // Check karo ki user bana bi hai ki nahi
  const createdUser=await User.findById(user._id).select(
    "-password -refreshToken"         // it removes ki ye field nahi chahie
  )
  
  if(!createdUser)throw new ApiError(500,"Something went wrong while registering the User")

  return res.status(201).json(
    new ApiResponse(200,createdUser,"User Registered Successfully")  // Generic response banaya hua hai
  )
  
})

export {registerUser};