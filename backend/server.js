// server.js

import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 3001; // The port your server will run on

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable parsing of JSON bodies

// Initialize the Google Gemini AI client with your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Define the /api/chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, unit, topic } = req.body;

    // Get the gemini-pro model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Construct a detailed prompt for the AI
    const prompt = `
      You are an AI assistant for a student.
      The student is currently studying:
      Unit: ${unit || 'Not specified'}
      Topic: ${topic || 'Not specified'}

      The student's message is: "${message}"

      Provide a helpful and relevant response based on this context.
    `;

    // Generate content based on the prompt
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Send the AI's response back to the frontend
    res.json({ reply: text });
  } catch (error) {
    console.error('Error with Gemini API:', error);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});