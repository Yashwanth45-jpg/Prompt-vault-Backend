// services/ai.service.js

// 1. Correct package name is @google/generative-ai
const { GoogleGenerativeAI } = require("@google/generative-ai");

// 2. Initialize the client with your API key from the .env file
// Make sure your .env file has a variable like: GEMINI_KEY=your_api_key_here
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

/**
 * Generates a refined prompt using the Gemini model.
 * @param {string} originalPrompt The user's initial prompt text.
 * @returns {Promise<string>} The generated text from the AI model.
 */
async function generateTagsForPrompt(originalPrompt) {
  try {
    // 3. Get the specific generative model you want to use
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 4. The system instruction and prompt are part of the contents array
    const fullPrompt = `Based on the following prompt, generate 3-5 relevant, single-word tags in lowercase. Return them as a comma-separated string. For example: "marketing,copywriting,social-media".\n\nPrompt: "${originalPrompt}"`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response: split by comma and trim whitespace
    const tags = text.split(',').map(tag => tag.trim().toLowerCase());
    
    return tags;

  } catch (error) {
    console.error("Error generating tags with Gemini:", error);
    // Return an empty array or throw the error so the controller can handle it
    return []; 
  }
}

module.exports = { generateTagsForPrompt };
