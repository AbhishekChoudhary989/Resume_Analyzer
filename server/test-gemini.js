const express = require('express');
const { GoogleGenAI } = require("@google/genai");
const fs = require('fs');
const path = require('path');
const router = express.Router();
const pdf = require('pdf-parse');

const googleAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/chat', async (req, res) => {
    try {
        const { prompt, fileUrl } = req.body;
        let resumeText = "";

        if (fileUrl && fileUrl.includes('/uploads/')) {
            const filename = fileUrl.split('/uploads/')[1];
            const filePath = path.join(__dirname, '../uploads', filename);

            if (fs.existsSync(filePath)) {
                const dataBuffer = fs.readFileSync(filePath);

                // ✅ FIX: Use a robust check for the pdf-parse function
                const parseFn = typeof pdf === 'function' ? pdf : pdf.default;

                if (typeof parseFn !== 'function') {
                    throw new Error("PDF parser is not a function.");
                }

                // Standard pdf-parse call (it's not a class, so no 'new' needed)
                const data = await parseFn(dataBuffer);
                resumeText = `\n\nRESUME CONTENT:\n${data.text}`;
            }
        }

        // ✅ MATCHING YOUR test-gemini.js WORKING SYNTAX
        const systemInstruction = "You are an expert AI Resume Analyzer. Output must be in JSON format only.";
        const fullPrompt = `${systemInstruction}\n\n${prompt}\n${resumeText}`;

        const response = await googleAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
        });

        // Use .text as you did in your successful test
        res.json({ message: { content: response.text } });

    } catch (error) {
        console.error("❌ AI Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;