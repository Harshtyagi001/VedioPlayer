import asyncHandler from './../utils/assyncHandler.js';
import ApiError from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import uploadOnCloudinary from '../utils/cloudinary.js';
import ApiResponse from './../utils/ApiResponse.js';
import { jwt } from 'jsonwebtoken';


const generateAccessAndRefreshTokens=async(userId)=>{
  try{
    const user=await User.findById(userId)
    const accessToken=user.generateAccessToken();
    const refreshToken=user.generateRefreshToken();

    user.refreshToken=refreshToken;
    await user.save({validateBeforeSave: false});  // Vo Schema vale custom checks ko avoid krne ke liye
    return {accessToken,refreshToken}

  }catch(error){
    throw new ApiError(500,"Something went wrong while generating Access and Refresh Tokens")
  }
}

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

const loginUser=asyncHandler(async (req,res)=>{
  // req body se data nikalo
  // username or email se user find karo
  // password ko compare karo
  // access token and refresh token generate karo
  // send cookies to frontend
  
  const {username , email , password}=req.body;
  if([username,email].some((field)=>field.trim()==="")){
    throw new ApiError(400,"Username or Email is required")
  }
  
  const user=await User.findOne({
    $or: [{username,email}]
  })
  
  if(!user)throw new ApiError(404,"User doesn't exist");

  // Check password using the custom Schema method we made
  const isPasswordValid=await user.isPasswordCorrect(password);
  if(!isPasswordValid)throw new ApiError(401,"Invalid Password")

  // generate access and refresh tokens
  const {accessToken,refreshToken}= await generateAccessAndRefreshTokens(user._id);

  // send cookies to frontend

  const loggedInUser=await User.findById(user._id).select("-password -refreshToken")

  const options={    // By doing this , cookies can only be modifiable by server
    httpOnly: true,
    secure: true
  }
  
  return res.status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(new ApiResponse(200,{user: loggedInUser,accessToken,refreshToken},"User LoggedIn Successfully"))
})

const logOutUser=asyncHandler(async (req,res)=>{
 const user=req.user._id
  const loggedOutUser=await User.findByIdAndUpdate(user,
  {
    $set:{refreshToken: undefined}
  },
  {new: true}
)

const options={
  httpOnly: true,
  secure:true
}

return res.status(200)
.clearCookie("accessToken",options)
.clearCookie("refreshToken",options)
.json(new ApiResponse(200,loggedOutUser,"User Logged Out Successfully"))
})

const refreshAccessToken=asyncHandler(async(req,res)=>{
  try{
    const incomingRefreshToken=req.cookies?.refreshToken|| req.body?.refreshToken || req.header("Authorization")?.replace("Bearer ","");
    if(!incomingRefreshToken)throw new ApiError(401,"Unauthorized Request")

    const decodedToken=jwt.verify(
       incomingRefreshToken,
       process.env.REFRESH_TOKEN_SECRET
     )

     const user= await User.findById(decodedToken?._id)

     if(!user){
        throw new ApiError(401,"Invalid Refresh Token")    
     }

     if(incomingRefreshToken!==user.refreshToken){
       throw new ApiError(401,"Refresh Token is expired ")
     }

     const options={
      httpOnly: true,
      secure:true
     }

     const {accessToken,newRefreshToken}=await generateAccessAndRefreshTokens(user._id);

     return res.status(200)
     .cookie("accessToken",accessToken,options)
     .cookie("refreshToken",newRefreshToken,options)
     .json(new ApiResponse(200,{accessToken,newRefreshToken},"Access Token Refreshed Successfully"))
  }catch(error){
    throw new ApiError(500,"Something went wrong while refreshing Access Token")
  } 
})

export {registerUser,loginUser,logOutUser,refreshAccessToken};