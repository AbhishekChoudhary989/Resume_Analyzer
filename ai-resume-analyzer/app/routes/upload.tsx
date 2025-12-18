import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import { convertPdfToImage } from "~/lib/pdf2img";

const BACKEND_URL = "http://localhost:5000";

// Relaxed IT Keywords (Added more common terms)
const IT_KEYWORDS = [
    "developer", "engineer", "programmer", "coder", "architect", "admin",
    "analyst", "data", "scientist", "cloud", "network", "security", "cyber",
    "web", "frontend", "backend", "full stack", "devops", "sre", "qa", "tester",
    "ui", "ux", "product", "manager", "lead", "tech", "support", "consultant",
    "ios", "android", "mobile", "software", "hardware", "embedded", "firmware",
    "it ", "information technology", "ai", "ml", "machine learning", "robotics",
    "scrum", "agile", "database", "sql", "nosql", "java", "python", "react", "node",
    "c++", "c#", "aws", "azure", "linux", "windows", "computer", "system"
];

export default function UploadPage() {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [file, setFile] = useState<File | null>(null);
    const [jobTitle, setJobTitle] = useState("");
    const [jobDesc, setJobDesc] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        if (!localStorage.getItem("token")) navigate("/auth");
        else setIsAuthenticated(true);
    }, [navigate]);

    const handleAnalyze = async () => {
        setErrorMsg("");

        if (!file) return setErrorMsg("Please upload a resume PDF.");

        const lowerTitle = jobTitle.toLowerCase().trim();
        if (lowerTitle.length < 2) return setErrorMsg("Job Title is too short.");

        // Keyword Check
        const isIT = IT_KEYWORDS.some(keyword => lowerTitle.includes(keyword));
        if (!isIT) return setErrorMsg("⚠️ Please enter a Tech/IT job title (e.g. Developer, Analyst).");

        setLoading(true);

        try {
            // 1. Generate Thumbnail
            let imageFile: File | null = null;
            try {
                const result = await convertPdfToImage(file);
                if (result.file) imageFile = result.file;
            } catch (e) {
                console.warn("Thumbnail failed (continuing...):", e);
            }

            // 2. Upload Files
            const formData = new FormData();
            formData.append("files", file);
            if (imageFile) formData.append("files", imageFile);

            const uploadRes = await fetch(`${BACKEND_URL}/api/files/upload`, {
                method: "POST",
                body: formData
            });

            if (!uploadRes.ok) throw new Error("File upload failed. Check server.");
            const filesResponse = await uploadRes.json();
            const resumePath = filesResponse[0]?.url;
            const imagePath = filesResponse.length > 1 ? filesResponse[1]?.url : "";

            // 3. Analyze with AI
            const customPrompt = `
                Target Role: ${jobTitle}
                Job Description: ${jobDesc || "Not provided"}
                
                INSTRUCTIONS: 
                1. Analyze the resume against the Target Role.
                2. If the resume matches well, give a High Score (80+).
                3. If it matches partially, give a Medium Score (50-79).
                4. If it is irrelevant, give a Low Score (0-49).
                5. STRICTLY RETURN VALID JSON.
            `;

            const aiRes = await fetch(`${BACKEND_URL}/api/ai/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: customPrompt, fileUrl: resumePath })
            });

            // ✅ READ REAL ERROR MESSAGE
            if (!aiRes.ok) {
                const errorData = await aiRes.json();
                // This displays "Document too short" or "Not a Resume" to the user
                throw new Error(errorData.error || `Server Error (${aiRes.status})`);
            }

            const aiData = await aiRes.json();

            // ✅ SAFETY: Handle empty/broken JSON response
            let feedback;
            try {
                const cleanJson = aiData.message.content.replace(/```json|```/g, "").trim();
                feedback = JSON.parse(cleanJson);
            } catch (e) {
                console.error("AI JSON Parse Error:", aiData.message.content);
                throw new Error("AI returned invalid data. Please try again.");
            }

            // 4. Save Result
            const newId = Date.now().toString();
            const newResume = {
                id: newId,
                companyName: "Target: " + jobTitle,
                jobTitle: feedback.jobTitle || jobTitle,
                overallScore: feedback.overallScore || 0,
                resumePath: resumePath,
                imagePath: imagePath,
                feedback: feedback,
                createdAt: new Date()
            };

            await fetch(`${BACKEND_URL}/api/kv/set`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key: `resume:${newId}`, value: newResume })
            });

            navigate(`/resume/${newId}`);

        } catch (error: any) {
            console.error("Full Error:", error);
            // Show the actual error to the user
            setErrorMsg(error.message || "Analysis failed. See console.");
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-slate-50 relative">
            <div className="fixed inset-0 z-0 pointer-events-none bg-grid-pattern opacity-[0.4]" />
            <div className="relative z-10">
                <Navbar />
                <div className="max-w-3xl mx-auto pt-28 px-6 pb-20">
                    <div className="mb-10 text-center">
                        <h1 className="text-4xl font-black text-slate-900 mb-4">Target Your Analysis</h1>
                        <p className="text-lg text-slate-500">Tell us about the job you want.</p>
                    </div>

                    <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl border border-slate-100 space-y-6">

                        {/* ✅ ERROR BANNER: Now shows real reasons */}
                        {errorMsg && (
                            <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-bold text-center animate-in fade-in">
                                ⚠️ {errorMsg}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Target Job Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. Senior Product Designer"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Job Description</label>
                            <textarea
                                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                                placeholder="Paste the job description here..."
                                value={jobDesc}
                                onChange={(e) => setJobDesc(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Resume <span className="text-red-500">*</span></label>
                            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-2">
                                <FileUploader onFileSelect={(f) => setFile(f)} />
                            </div>
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={loading}
                            className={`w-full py-4 rounded-xl font-bold text-white transition-all
                                ${loading
                                ? "bg-slate-300 cursor-not-allowed"
                                : "bg-slate-900 hover:bg-slate-800 shadow-lg"}`}
                        >
                            {loading ? "Analyzing..." : "Run Strict Analysis"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}