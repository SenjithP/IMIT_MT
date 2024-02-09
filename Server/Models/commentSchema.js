import mongoose, { Schema } from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,    
      ref: "User",
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    postComment: {
      type: String,
      required: true,
    },
    replies: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          default: null,
        },

        comment: { type: String },
        created_At: { type: Date, default: Date.now },
        updated_At: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
