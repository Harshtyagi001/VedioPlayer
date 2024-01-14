import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "Text is required!"],
    trim: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video",
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
  replies:{
    type:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Comment"
    }]
  }
}, { timestamps: true });

export const Comment = mongoose.model("Comment", commentSchema);