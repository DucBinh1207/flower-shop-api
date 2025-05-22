import { Schema, model } from "mongoose";
import {
  IComment,
  CommentDocument,
} from "../interfaces/models/comment.interface";

const commentSchema = new Schema<IComment>(
  {
    productId: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userAvatar: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: String,
      default: () => new Date().toISOString(),
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (_, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes
commentSchema.index({ productId: 1 });
commentSchema.index({ userId: 1 });
commentSchema.index({ rating: -1 });
commentSchema.index({ createdAt: -1 });

// @ts-ignore
const Comment = model<CommentDocument>("Comment", commentSchema);

export default Comment;
