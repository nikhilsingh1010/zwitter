import mongoose from "mongoose";

const tweetSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    like: {
      type: Array,
      default: [],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    userDetails: {
      type: Array,
      default: [],
    },
    bookmarks: {
      // Add bookmarks field
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
  },
  { timestamps: true }
);

export const Tweet = mongoose.model("Tweet", tweetSchema);
