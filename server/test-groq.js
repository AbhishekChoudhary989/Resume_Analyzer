// server/test-groq.js
require('dotenv').config();
const Groq = require("groq-sdk");
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse'); // Assumes v1.1.1 standard version

// 1. Setup Groq
const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) {
    console.error("❌ ERROR: GROQ_API_KEY is missing in .env file");
    process.exit(1);
}
const groq = new Groq({ apiKey });

async function runTest() {
    try {
        console.log("🚀 STARTING GROQ (LLAMA 3.3) DIAGNOSTIC...");

        // 2. Locate a Test PDF
        const uploadsDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            throw new Error("'uploads' folder is missing. Please create it and add a PDF.");
        }

        const files = fs.readdirSync(uploadsDir);
        const pdfFile = files.find(f => f.toLowerCase().endsWith('.pdf'));

        if (!pdfFile) {
            throw new Error("No PDF file found in 'server/uploads'. Please add one to test.");
        }

        console.log(`✅ Found File: ${pdfFile}`);
        const filePath = path.join(uploadsDir, pdfFile);
        const buffer = fs.readFileSync(filePath);

        // 3. Extract Text
        console.log("   ...Parsing PDF...");
        let pdfText = "";

        try {
            const data = await pdf(buffer);
            pdfText = data.text;
        } catch (e) {
            // Fallback if library version is weird
            const data = await new pdf(buffer);
            pdfText = data.text;
        }

        if (!pdfText || pdfText.length === 0) {
            throw new Error("PDF Parser returned empty text.");
        }

        console.log(`✅ PDF Extracted! Length: ${pdfText.length} chars`);

        // 4. Send to Groq (Updated Model)
        console.log("   ...Sending to Groq (llama-3.3-70b-versatile)...");

        const systemPrompt = `
        Analyze this resume text and return a valid JSON object with these keys:
        {
            "companyName": "Candidate's recent company",
            "jobTitle": "Candidate's role",
            "overallScore": 85
        }
        RETURN ONLY JSON.
        `;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Resume: ${pdfText.substring(0, 3000)}` }
            ],
            // ✅ CORRECTED MODEL NAME (The old one is decommissioned)
            model: "llama-3.3-70b-versatile",

            temperature: 0.1,
            response_format: { type: "json_object" } // Enforces JSON
        });

        // 5. Check Response
        console.log("   ...Received Response...");

        const rawJson = completion.choices[0]?.message?.content;

        if (!rawJson) throw new Error("Groq returned empty response.");

        // 6. Validate JSON
        const parsed = JSON.parse(rawJson);

        console.log("\n🎉 SUCCESS! Groq Llama 3.3 works perfectly.");
        console.log("---------------------------------------------------");
        console.log("extracted company:", parsed.companyName);
        console.log("extracted role:   ", parsed.jobTitle);
        console.log("extracted score:  ", parsed.overallScore);
        console.log("---------------------------------------------------");

    } catch (error) {
        console.error("\n❌ TEST FAILED:", error.message);
        if (error.error && error.error.code === 'model_decommissioned') {
            console.error("💡 HINT: The model name is invalid. Ensure you are using 'llama-3.3-70b-versatile'.");
        }
    }
}

runTest();