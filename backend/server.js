import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
// MODIFICATION: Use the PORT from environment variables for Render, with a fallback for local dev
const port = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable parsing of JSON bodies

// Initialize the Google Gemini AI client with your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// MODIFICATION: A helper function to create a delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


// Define the /api/chat endpoint
app.post('/api/chat', async (req, res) => {
  const { message, unit, topic } = req.body;

  // MODIFICATION: Define retry parameters
  const maxRetries = 3;
  let currentRetry = 0;
  let waitTime = 1000; // Start with a 1-second wait

  // MODIFICATION: Start a loop for retrying the API call
  while (currentRetry < maxRetries) {
    try {
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

      // If successful, send the response and exit the function
      return res.json({ reply: text });

    } catch (error) {
      // MODIFICATION: Check if the error is the specific '503 overloaded' error
      // The error object from the SDK might not have a .status property directly,
      // so checking the message is a reliable way to catch it.
      if (error.message && error.message.includes('503')) {
        currentRetry++; // Increment the retry counter
        console.log(`Model overloaded. Retrying in ${waitTime / 1000}s... (${currentRetry}/${maxRetries})`);
        
        // If we've reached the max number of retries, give up
        if (currentRetry >= maxRetries) {
          console.error('Max retries reached. Failing request.');
          break; // Exit the loop to send the final error response
        }
        
        await delay(waitTime); // Wait for the specified time
        waitTime *= 2; // Double the wait time for the next attempt

      } else {
        // If it's a different kind of error, log it and fail immediately
        console.error('Error with Gemini API (not a 503):', error);
        return res.status(500).json({ error: 'Failed to get response from AI due to a non-retryable error.' });
      }
    }
  }

  // MODIFICATION: This part is only reached if the loop finishes without a success
  console.error('Error with Gemini API: Model still overloaded after all retries.');
  res.status(503).json({ error: 'Failed to get response from AI. The service is temporarily unavailable. Please try again in a moment.' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
