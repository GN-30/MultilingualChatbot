// server.js

// New ES Module syntax
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config(); // Call config after importing

const app = express();
// Use the PORT environment variable provided by Render, or 3001 for local development
const PORT = process.env.PORT || 3001;

// --- CORS Configuration for Production ---
// This list specifies which frontend URLs are allowed to make requests to this server.
const allowedOrigins = [
  'http://localhost:5173', // Your local Vite dev environment
   // Your local create-react-app dev environment
   // **IMPORTANT**: Replace this with your actual Vercel URL after deploying the frontend
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));
app.use(express.json()); // Middleware to parse JSON bodies

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// --- Temporary Test Route ---
// Useful for checking if the server is running and reachable.
app.get('/', (req, res) => {
  res.send('<h1>Backend server is running and reachable!</h1>');
});

// --- Main Chat API Endpoint ---
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not defined. Check your .env file or Render environment variables.");
    return res.status(500).json({ error: 'API key not configured on the server.' });
  }

  if (!message) {
    return res.status(400).json({ error: 'Message is required in the request body.' });
  }

  const prompt = `You are an expert full stack web development assistant. Your purpose is to provide clear, accurate, and helpful information on topics like HTML, CSS, JavaScript, React, Node.js, Express, databases, and other web technologies. If a user asks a question unrelated to web development, politely state that your expertise is focused on that area. User query: "${message}"`;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;
  const payload = { contents: [{ parts: [{ text: prompt }] }] };

  try {
    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!apiResponse.ok) {
      const errorBody = await apiResponse.text();
      console.error("API Error Response:", errorBody);
      throw new Error(`API request failed with status ${apiResponse.status}`);
    }

    const data = await apiResponse.json();
    res.json(data);
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'Failed to fetch from Gemini API.' });
  }
});

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
