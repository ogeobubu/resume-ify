import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";

const app = express.Router();

app.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User signed up successfully!" });
  } catch (error) {
    console.error("Sign-up error:", error);
    res.status(500).json({ message: "Sign-up failed: " + error.message });
  }
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userProfile = await User.findOne({ email });
    if (!userProfile) {
      return res.status(400).json({ message: "User does not exist!" });
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      userProfile.password
    );
    if (isPasswordValid) {
      const token = jwt.sign({ id: userProfile._id }, process.env.JWT_SECRET, {
        expiresIn: "5m",
      });
      return res
        .status(200)
        .json({ message: "User logged in successfully!", token });
      return res
        .status(200)
        .json({ message: "User logged in successfully!", token });
    } else {
      return res.status(400).json({ message: "Email/Password is invalid!" });
    }
  } catch (error) {
    console.error("Sign-in error:", error);
    res.status(500).json({ message: "Server error! Try again later." });
  }
});

export default app;
