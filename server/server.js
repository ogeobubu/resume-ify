import express from "express";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";

// Convert import.meta.url to a usable path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

// Google Authentication
app.get(
  "/api/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const frontendUrl = process.env.FRONTEND_URL;
    res.redirect(frontendUrl);
  }
);

// MongoDB connection
const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 20000,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Create a User model
const User = mongoose.model("User", userSchema);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../dist")));

// Routes
app.get("/api", (req, res) => {
  res.status(200).json({
    message: "Hello World",
  });
});

// Sign-up endpoint
app.post("/api/signup", async (req, res) => {
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

// Sign-in endpoint
app.post("/api/signin", async (req, res) => {
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
      return res.status(200).json({ message: "User logged in successfully!" });
    } else {
      return res.status(400).json({ message: "Email/Password is invalid!" });
    }
  } catch (error) {
    console.error("Sign-in error:", error);
    res.status(500).json({ message: "Server error! Try again later." });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
