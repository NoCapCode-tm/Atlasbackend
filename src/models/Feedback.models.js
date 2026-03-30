import mongoose from "mongoose";
import { atlasConnection } from "../database/dbconnect.js";

const FeedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  peerRating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0,
  },

  comment: {
    type: String,
    default: "",
    trim: true,
  },

  date: {
    type: String, // YYYY-MM-DD
    default: () => new Date().toISOString().split("T")[0],
  },
});

export const Feedback = atlasConnection.model("Feedback", FeedbackSchema);
