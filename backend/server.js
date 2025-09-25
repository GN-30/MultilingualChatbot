import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables from .env file for local development
dotenv.config();

const app = express();
// Use the PORT provided by the hosting environment (like Render), or 3001 for local use
const port = process.env.PORT || 3001;

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable parsing of JSON request bodies

// --- Initialize Gemini AI Client ---
// Ensure you have your GOOGLE_API_KEY set in your .env file or Render environment variables
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// A helper function to create a delay for retries
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


// --- API Endpoint: /api/chat ---
app.post('/api/chat', async (req, res) => {
  // --- THIS IS THE CORRECTED LINE ---
  // We are now correctly using '=' for object destructuring
  const { message, history, unit, topic } = req.body;
  // --- END OF CORRECTION ---

  // --- Retry Logic Configuration ---
  const maxRetries = 2;
  let currentRetry = 0;
  let waitTime = 500;

  // --- Loop for API Call with Retries ---
  while (currentRetry < maxRetries) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      let historyString = '';
      if (history && history.length > 1) {
        historyString = history.map(entry => {
          const prefix = entry.sender === 'user' ? 'Student:' : 'AI:';
          return `${prefix} ${entry.text}`;
        }).join('\n');
      }

      const prompt = `
        You are an AI assistant for a student. Your primary goal is to answer the student's question directly.
        Do not ask clarifying questions unless the user's request is completely ambiguous.
        Keep your answers concise and to the point.

        The student is currently studying:
        Unit: ${unit || 'Not specified'}
        Topic: ${topic || 'Not specified'}

        ---
        CONVERSATION HISTORY:
        ${historyString}
        ---

        The student's new message is: "${message}"

        Provide a direct and helpful answer based on the full conversation context.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return res.json({ reply: text });

    } catch (error) {
      if (error.message && error.message.includes('503')) {
        currentRetry++;
        console.log(`Model overloaded. Retrying in ${waitTime / 1000}s... (${currentRetry}/${maxRetries})`);

        if (currentRetry >= maxRetries) {
          console.error('Max retries reached. Failing the request.');
          break;
        }

        await delay(waitTime);
        waitTime *= 2;

      } else {
        console.error('An unrecoverable error occurred with the Gemini API:', error);
        return res.status(500).json({ error: 'Failed to get response from AI due to a non-retryable error.' });
      }
    }
  }

  console.error('Error: Model still overloaded after all retries.');
  return res.status(503).json({ error: 'The AI service is temporarily unavailable. Please try again in a moment.' });
});

// --- Start the Server ---
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

