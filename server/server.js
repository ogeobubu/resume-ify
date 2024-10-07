import "./passport-setup.js";
import express from "express";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { User } from "./models/User.js";
import Interview from "./models/Interview.js";
import axios from "axios";
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
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
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.static(path.join(__dirname, "../dist")));

// Routes
app.use("/api", authRoutes)
app.use("/api/user", userRoutes)

// Sign-up endpoint




// const callOpenAIWithBackoff = async (prompt, retries = 0) => {
//   try {
//     const response = await axios.post(
//       'https://api.openai.com/v1/chat/completions',
//       {
//         model: 'gpt-3.5-turbo',
//         messages: [{ role: 'user', content: prompt }],
//         max_tokens: 50, // Reduce token count to stay within limits
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );
//     return response.data.choices[0].message.content.trim().split('\n');
//   } catch (error) {
//     if (error.response && error.response.status === 429 && retries < 5) {
//       const waitTime = Math.pow(2, retries) * 2000; // Increase backoff time
//       console.log(`Rate limit hit. Retrying in ${waitTime / 1000} seconds...`);
//       await new Promise((resolve) => setTimeout(resolve, waitTime));
//       return callOpenAIWithBackoff(prompt, retries + 1);
//     } else if (error.response) {
//       console.error('Error response from OpenAI:', error.response.data);
//     } else {
//       console.error('Error in making request:', error.message);
//     }
//     throw error;
//   }
// };
const HF_API_URL = 'https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-2.7B';

const callHuggingFace = async (prompt) => {
  try {
    const response = await axios.post(
      HF_API_URL,
      {
        inputs: prompt,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data[0].generated_text.split("\n");
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
};

// Usage in your route
app.post("/api/interview-prep", async (req, res) => {
  const { jobTitle, jobDescription, interviewDate, resumeText } = req.body;

  try {
    const prompt = `
      Based on the following job title and description, generate a list of likely interview questions.
      
      Job Title: ${jobTitle}
      Job Description: ${jobDescription}
      Resume: ${resumeText}
      
      Please provide a list of questions.
    `;

    const questions = await callHuggingFace(prompt);

    // Save to database and respond
    const newInterview = new Interview({
      jobTitle,
      jobDescription,
      interviewDate,
      resumeText,
      questions,
    });

    await newInterview.save();

    res.status(201).json({
      message: "Interview prepared successfully!",
      questions,
    });
  } catch (error) {
    if (error.response && error.response.status === 429) {
      return res.status(429).json({
        message: "Rate limit exceeded, please try again after some time.",
      });
    }
    res.status(500).json({
      message: "An error occurred while generating questions.",
      error: error.message,
    });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
