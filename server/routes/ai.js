// server/routes/ai.js
const express = require('express');
const Groq = require("groq-sdk");
const fs = require('fs');
const path = require('path');
const router = express.Router();
const pdf = require('pdf-parse');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function extractText(buffer) {
    try {
        const data = await pdf(buffer);
        return data.text;
    } catch (e) {
        console.error("PDF Parsing Error:", e);
        return "";
    }
}

router.post('/chat', async (req, res) => {
    try {
        const { prompt, fileUrl } = req.body;
        let resumeText = "";

        if (fileUrl && fileUrl.includes('/uploads/')) {
            const filename = fileUrl.split('/uploads/')[1];
            const filePath = path.resolve(__dirname, '..', 'uploads', filename);

            if (fs.existsSync(filePath)) {
                const buffer = fs.readFileSync(filePath);
                resumeText = await extractText(buffer);
            }
        }

        // 1. Check for Empty Text (Scanned PDF)
        if (!resumeText || resumeText.trim().length < 50) {
            return res.status(400).json({
                error: "Resume text could not be read. If this is a scanned image, please use a text-based PDF."
            });
        }

        console.log(`📄 Analysis started. Text Length: ${resumeText.length}`);

        const systemPrompt = `
        You are an expert ATS (Applicant Tracking System).
        Analyze the resume text provided.
        
        CRITICAL CHECKS:
        1. Is this a Resume? (Look for Experience, Education, Skills, Contact Info).
        2. If it is clearly NOT a resume (e.g. "Invoice", "Homework", "Project Report"), return JSON: { "error": "NOT_A_RESUME" }.
        
        If it IS a resume, perform the analysis and return this JSON structure:
        {
            "companyName": "Candidate's Current/Past Company",
            "jobTitle": "Candidate's Role",
            "overallScore": 0-100,
            
            // NEW FIELDS ADDED HERE
            "summary": "A professional 3-4 sentence executive summary of the candidate's profile, highlighting their experience level and main focus.",
            "headPoints": ["Key strength or achievement 1", "Key strength or achievement 2", "Key strength or achievement 3"],
            
            "ATS": { "score": 0-100, "tips": [{"type": "good"|"improve", "tip": "string"}] },
            "content": { "score": 0-100, "tips": [] },
            "structure": { "score": 0-100, "tips": [] },
            "skills": { "score": 0-100, "tips": [] },
            "toneAndStyle": { "score": 0-100, "tips": [] }
        }
        `;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Context: ${prompt}\n\nResume Text: ${resumeText.substring(0, 25000)}` }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.1,
            response_format: { type: "json_object" }
        });

        const cleanJson = completion.choices[0]?.message?.content || "{}";
        const parsed = JSON.parse(cleanJson);

        // 2. Handle Rejection
        if (parsed.error === "NOT_A_RESUME") {
            return res.status(422).json({
                error: "The uploaded file does not appear to be a resume. It looks like a report or other document."
            });
        }

        res.json({ message: { content: cleanJson } });

    } catch (error) {
        console.error("AI Error:", error.message);
        res.status(500).json({ error: "AI Service Error: " + error.message });
    }
});

module.exports = router;