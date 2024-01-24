import mongoose,{Schema} from 'mongoose';
import bcrypt from 'bcrypt';
const userSchema = new Schema({
    username:{
      type:String,
      unique:true,
      required:true,
      trim:true,
      index:true   // to make it searchable faster
    },
    email:{
      type:String,
      unique:true,
      required:true,
      lowercase:true,
      trim:true,
    },
   fullName:{
    type:String,
    required:true,
    trim:true,
    index:true
   },
   avatar:{
    type:String,   // image url
    trim:true,
   },
   coverImage:{
    type:String,   // CoverImage url
   },
   watchHistory:{
    type:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Video"
    }]
   },
   password:{
    type:String,
    required:[true,"Password is required!"]
   },
   refreshToken:{
    type:String,
   }
},{timestamps:true})


userSchema.pre("save",async function(next){  // async because it takes time to do this (cryptographt functions are time taking) , and it is a middleware as we are using before saving
if(!this.isModified("password")) return next(); // want to run first time and only when password is modified
  this.password=await bcrypt.hash(this.password,10);  // (what to hash,how many rounds)
  next();
})


// ****injecting methods to userSchema
userSchema.methods.isPasswordCorrect=async function(password){
  return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=function(){
  jwt.sign({
    _id: this._id,
    email:this.email,
    username:this.username,
    fullName:this.fullName,
  },
process.env.ACCESS_TOKEN_SECRET,
{
  expiresIn:process.env.ACCESS_TOKEN_EXPIRY
},
)
}

userSchema.methods.generateRefreshToken=function(){
  jwt.sign({
    _id: this._id,
    email:this.email,
    username:this.username,
    fullName:this.fullName,
  },
process.env.REFRESH_TOKEN_SECRET,
{
  expiresIn:process.env.REFRESH_TOKEN_EXPIRY
}
  )
}


export const User=mongoose.model("User",userSchema)