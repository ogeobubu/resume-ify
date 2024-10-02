import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  googleId: { type: String },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
});

export const User = mongoose.model("User", userSchema);
