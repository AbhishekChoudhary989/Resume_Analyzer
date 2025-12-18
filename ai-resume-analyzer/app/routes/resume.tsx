import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";

const BACKEND_URL = "http://localhost:5000";

export default function Resume() {
    const { id } = useParams();
    const [feedback, setFeedback] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [resumeUrl, setResumeUrl] = useState("");

    useEffect(() => {
        const load = async () => {
            if (!id) return;
            try {
                const res = await fetch(`${BACKEND_URL}/api/kv/get/resume:${id}`);
                if (!res.ok) throw new Error("Resume not found");

                const data = await res.json();

                // Set File URL
                if (data.resumePath) {
                    const url = data.resumePath.startsWith("http") ? data.resumePath : `${BACKEND_URL}${data.resumePath}`;
                    setResumeUrl(url);
                }

                // Set Feedback
                let fb = data.feedback;
                if (typeof fb === 'string') fb = JSON.parse(fb); // Extra safety
                setFeedback(fb);

            } catch (e) {
                console.error("Load failed", e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left: PDF */}
            <div className="w-full md:w-1/2 bg-slate-100 h-[50vh] md:h-screen p-4 sticky top-0">
                <Link to="/" className="mb-4 inline-block text-sm font-bold text-slate-500 hover:text-blue-600">← Back Home</Link>
                <div className="h-full bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
                    {resumeUrl ? (
                        <iframe src={resumeUrl} className="w-full h-full" title="Resume" />
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-400">Loading PDF...</div>
                    )}
                </div>
            </div>

            {/* Right: Results */}
            <div className="w-full md:w-1/2 p-8 overflow-y-auto">
                <h1 className="text-3xl font-black text-slate-900 mb-8">Neural Review</h1>

                {loading ? (
                    <div className="text-center py-10"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>Analyzing...</div>
                ) : feedback ? (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <Summary feedback={feedback} />
                        <ATS
                            score={feedback.ATS?.score || 0}
                            suggestions={feedback.ATS?.tips || []}
                        />
                        <Details feedback={feedback} />
                    </div>
                ) : (
                    <div className="p-8 bg-red-50 text-red-600 rounded-xl border border-red-100 text-center">
                        Analysis data unavailable. <br/> Please try re-uploading the resume.
                    </div>
                )}
            </div>
        </div>
    );
}