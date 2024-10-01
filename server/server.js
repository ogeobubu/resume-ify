import express from "express";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import cors from "cors";
import "./passport-setup.js";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const PORT = process.env.PORT || 3000;

dotenv.config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 20000,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define a User schema
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Create a User model
const User = mongoose.model("User", userSchema);

// Sign-up endpoint
app.post("/api/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({
      message: "User signed up successfully!",
    });
  } catch (error) {
    console.error("Sign-up error:", error);
    res.status(500).json({
      message: "Sign-up failed: " + error.message,
    });
  }
});

// Sign-in endpoint
app.post("/api/signin", async (req, res) => {
  const { email, password } = req.body;
  const userProfile = await User.findOne({ email });
  console.log(userProfile)
  if (userProfile) {
    const decryptPassword = await bcrypt.compare(
      password,
      userProfile.password
    );
    if (decryptPassword) {
      return res.status(200).json({
        message: "User logged in successfully!",
      });
    } else {
      return res.status(400).json({
        message: "Email/Password is invalid!",
      });
    }
  } else if(!userProfile) {
    return res.status(400).json({
      message: "User does not exist!",
    });
  } else {
    return res.status(500).json({
      message: "Server error! Try again later"
    })
  }
});

//GOOGLE AUTH
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("http://localhost:5173");
  }
);

app.get("/", (req, res) => {
  res.send('<h1>Home Page</h1><a href="/auth/google">Sign in with Google</a>');
});

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:3000");
});
