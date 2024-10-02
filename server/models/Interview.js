import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true,
  },
  jobDescription: {
    type: String,
    required: true,
  },
  interviewDate: {
    type: Date,
    required: true,
  },
  resumeText: {
    type: String,
    required: true,
  },
  questions: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;
