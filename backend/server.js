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
  const { message, unit, topic } of req.body;

  // --- Retry Logic Configuration ---
  // We will try up to 2 times with a short wait to balance speed and reliability.
  const maxRetries = 2; // Try the initial call, plus one retry
  let currentRetry = 0;
  let waitTime = 500; // Start with a quick 0.5-second wait

  // --- Loop for API Call with Retries ---
  while (currentRetry < maxRetries) {
    try {
      // Get the generative model
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // Construct the prompt with clear instructions for the AI
      const prompt = `
        You are an AI assistant for a student. Keep your answers concise and to the point.
        The student is currently studying:
        Unit: ${unit || 'Not specified'}
        Topic: ${topic || 'Not specified'}

        The student's message is: "${message}"
      `;

      // Generate content from the model
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // If the API call is successful, send the response and exit the function
      return res.json({ reply: text });

    } catch (error) {
      // Check if the error is a '503 Service Unavailable' (overloaded) error
      if (error.message && error.message.includes('503')) {
        currentRetry++; // Increment the retry counter
        console.log(`Model overloaded. Retrying in ${waitTime / 1000}s... (${currentRetry}/${maxRetries})`);

        // If we've reached the maximum number of retries, exit the loop
        if (currentRetry >= maxRetries) {
          console.error('Max retries reached. Failing the request.');
          break;
        }

        await delay(waitTime); // Wait before the next attempt
        waitTime *= 2; // Double the wait time for the subsequent retry

      } else {
        // If it's a different kind of error (e.g., API key issue), fail immediately
        console.error('An unrecoverable error occurred with the Gemini API:', error);
        return res.status(500).json({ error: 'Failed to get response from AI due to a non-retryable error.' });
      }
    }
  }

  // This response is sent only if the loop finishes after all retries have failed
  console.error('Error: Model still overloaded after all retries.');
  return res.status(503).json({ error: 'The AI service is temporarily unavailable. Please try again in a moment.' });
});

// --- Start the Server ---
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

