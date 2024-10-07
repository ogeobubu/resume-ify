import express from "express";
const app = express.Router();
import { verifyToken } from "../middleware/auth.js";
import { User } from "../models/User.js";

app.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.status(200).json({
      message: "Access to profile granted!",
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Profile retrieval error:", error);
    res.status(500).json({ message: "Server error! Try again later." });
  }
});

export default app;
