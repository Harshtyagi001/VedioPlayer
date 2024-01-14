import mongoose from "mongoose";

const vedioSchema = new mongoose.Schema({
   title:{
    type:String,
    required:[true,"Title is required!"],
    trim:true,
   },
   description:{
    type:String,
   },
   thumbnail:{
    type:String,
    required:[true,"Thumbnail is required!"],
   },
   vedioFile:{
    type:String,
    required:[true,"VedioFile is required!"],
   },
  duration:{
    type:Number,
    required:true,
  },
  isPublished:{
    type:Boolean,
    default:true,
  },
  views:{
    type:Number,
    default:0,
  },
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
  },
  likes:{
    type:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    }]
  },
  dislikes:{
    type:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    }]
  },
  comments:{
    type:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Comment"
    }]
  }
},{timestamps:true});



export const Vedio=mongoose.model("Vedio",vedioSchema);