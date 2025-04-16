import mongoose, { Schema } from "mongoose";
import { User } from "./User.models.js";

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
