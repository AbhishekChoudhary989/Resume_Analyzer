// server/test-ai-full-response.js
require('dotenv').config();
const { GoogleGenAI } = require("@google/genai");
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

// 1. Setup Gemini
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("❌ ERROR: GEMINI_API_KEY is missing in .env");
    process.exit(1);
}
const googleAI = new GoogleGenAI({ apiKey });

// 2. Setup PDF Parser
async function extractText(buffer) {
    try {
        const data = await pdf(buffer);
        return data.text;
    } catch (e) {
        console.error("PDF Parse Error:", e);
        return "";
    }
}

async function runDiagnostic() {
    try {
        console.log("🚀 STARTING DEEP DIAGNOSTIC...");

        // 3. Find a PDF
        const uploadsDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadsDir)) throw new Error("Uploads folder missing");

        const files = fs.readdirSync(uploadsDir);
        const pdfFile = files.find(f => f.toLowerCase().endsWith('.pdf'));

        if (!pdfFile) throw new Error("No PDF found. Please add a resume PDF to 'server/uploads'");

        console.log(`✅ Analyzing File: ${pdfFile}`);
        const buffer = fs.readFileSync(path.join(uploadsDir, pdfFile));
        const resumeText = await extractText(buffer);

        if (!resumeText) throw new Error("Failed to extract text from PDF");

        // 4. Send the REAL Prompt (Same as your App)
        console.log("   ...Sending to Gemini (1.5 Flash)...");

        const systemPrompt = `
        Analyze this resume and return a valid JSON object.
        Required JSON Structure:
        {
            "companyName": "Candidate's most recent company",
            "jobTitle": "Candidate's Job Title",
            "overallScore": 0-100,
            "summary": "Short executive summary",
            "ATS": { 
                "score": 0-100, 
                "tips": [{"type": "good"|"improve", "tip": "string"}] 
            },
            "toneAndStyle": { 
                "score": 0-100, 
                "tips": [{"type": "good"|"improve", "tip": "string", "explanation": "string"}] 
            },
            "content": { "score": 0-100, "tips": [...] },
            "structure": { "score": 0-100, "tips": [...] },
            "skills": { "score": 0-100, "tips": [...] }
        }
        RETURN ONLY JSON.
        `;

        // Use 1.5-flash to avoid 429 errors
        const response = await googleAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\nResume: ${resumeText.substring(0, 3000)}` }] }]
        });

        // 5. Check the Data
        const rawJson = response.text.replace(/```json|```/g, "").trim();
        const data = JSON.parse(rawJson);

        console.log("\n✅ AI RESPONSE RECEIVED:");
        console.log("==================================================");
        // This prints the FULL object structure
        console.dir(data, { depth: null, colors: true });
        console.log("==================================================");

        if (data.ATS && data.ATS.score) {
            console.log("✅ ATS Data: DETECTED");
        } else {
            console.error("❌ ATS Data: MISSING");
        }

    } catch (error) {
        console.error("\n❌ TEST FAILED:", error.message);
        if (error.message.includes("429")) {
            console.error("⚠️ QUOTA EXCEEDED: You need to wait or switch API keys.");
        }
    }
}

runDiagnostic();