require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// List of all possible model names to try
const modelsToTry = [
    "gemini-1.5-flash-001",   // Specific version (often works when generic fails)
    "gemini-1.5-flash-002",   // Newer specific version
    "gemini-1.5-flash-8b",    // Lightweight version
    "gemini-1.5-pro",         // Pro version (sometimes has different access)
    "gemini-1.5-pro-001",
    "gemini-1.0-pro",         // Old reliable fallback
    "gemini-2.0-flash-exp",   // Experimental version (might have separate quota)
];

async function findModel() {
    console.log("🔍 Testing models to find one that works for you...\n");

    for (const modelName of modelsToTry) {
        process.stdout.write(`👉 Testing '${modelName}'... `);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hi");
            const response = await result.response;

            console.log("\n\n✅ SUCCESS! WE FOUND A WORKING MODEL!");
            console.log(`🎉 PLEASE USE THIS NAME: "${modelName}"`);
            return; // Stop after finding the first working one

        } catch (error) {
            // Check specific error types
            if (error.message.includes("404")) {
                console.log("❌ Not Found");
            } else if (error.message.includes("429") || error.message.includes("Quota")) {
                console.log("❌ Quota Exceeded");
            } else {
                console.log(`❌ Error: ${error.message.split('[')[0]}`); // Short error
            }
        }
    }
    console.log("\n😞 All models failed. You might need to wait 24 hours for your quota to reset.");
}

findModel();