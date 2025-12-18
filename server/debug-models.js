require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function checkModels() {
    const key = process.env.GEMINI_API_KEY;

    if (!key) {
        console.error("❌ No API key found in .env file!");
        return;
    }

    console.log(`🔑 Testing Key: ${key.substring(0, 8)}...`);

    // 1. Try to list models using the raw API (bypassing potential SDK issues)
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("\n✅ SUCCESS! Google says you have access to these models:");
        console.log("-------------------------------------------------------");

        // Filter for just the 'generateContent' models we care about
        const usefulModels = data.models
            .filter(m => m.supportedGenerationMethods.includes("generateContent"))
            .map(m => m.name.replace("models/", "")); // Clean up the name

        usefulModels.forEach(name => console.log(`👉 "${name}"`));
        console.log("-------------------------------------------------------");
        console.log("\nTry updating your code to use one of the names above exactly.");

    } catch (error) {
        console.error("❌ Connection Failed:", error.message);
    }
}

checkModels();