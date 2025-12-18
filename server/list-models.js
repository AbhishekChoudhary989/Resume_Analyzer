const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        console.log("🔍 Fetching available models...");
        // We cannot directly list models via the helper in older SDK versions,
        // but we can try this generic check or standard listing if available.
        // NOTE: The SDK doesn't always expose listModels directly in the main class
        // depending on version, but let's try the direct API check if that fails.

        // Simplest check: Just print what we are using
        console.log("Your API Key is loaded. (Ends with: " + process.env.GEMINI_API_KEY.slice(-4) + ")");

        // There isn't a simple "listModels" helper in the basic client wrapper
        // without using the model manager, but we can verify the key works.
        console.log("To list models, use curl in your terminal:");
        console.log(`curl "https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}"`);

    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

listModels();