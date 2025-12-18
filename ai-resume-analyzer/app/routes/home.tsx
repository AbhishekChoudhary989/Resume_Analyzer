import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

const BACKEND_URL = "http://localhost:5000";

export function meta({}: Route.MetaArgs) {
    return [{ title: "AICARRER | Dashboard" }];
}

export default function Home() {
    const navigate = useNavigate();
    // 🔒 SECURITY STATE
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [resumes, setResumes] = useState<any[]>([]);
    const [loadingResumes, setLoadingResumes] = useState(true);

    // 🔒 1. PROTECT THE ROUTE
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/auth");
        } else {
            setIsAuthenticated(true);
        }
    }, [navigate]);

    // 2. Load Data
    useEffect(() => {
        if (!isAuthenticated) return;

        const loadResumes = async () => {
            setLoadingResumes(true);
            try {
                const res = await fetch(`${BACKEND_URL}/api/kv/list`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ pattern: 'resume:*' })
                });

                if (res.ok) {
                    const data = await res.json();
                    setResumes(data.reverse());
                }
            } catch (error) {
                console.error("Failed to load resumes:", error);
            } finally {
                setLoadingResumes(false);
            }
        }
        loadResumes();
    }, [isAuthenticated]);

    if (!isAuthenticated) return null;

    return (
        <main className="relative min-h-screen w-full bg-slate-50 text-gray-900 selection:bg-blue-100 selection:text-blue-900 overflow-hidden">

            {/* --- ANIMATED BACKGROUND (High Quality) --- */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Grid Overlay for texture */}
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.6]" />

                {/* Floating Blobs - Made slightly stronger for visibility */}
                <div className="absolute -top-[10%] -left-[10%] h-[700px] w-[700px] rounded-full bg-blue-400/30 blur-[100px] animate-[pulse_8s_ease-in-out_infinite]" />
                <div className="absolute top-[5%] -right-[10%] h-[600px] w-[600px] rounded-full bg-purple-400/30 blur-[100px] animate-[pulse_10s_ease-in-out_infinite_2s]" />
                <div className="absolute -bottom-[20%] left-[20%] h-[800px] w-[800px] rounded-full bg-indigo-400/20 blur-[120px] animate-[pulse_12s_ease-in-out_infinite_1s]" />
            </div>

            <div className="relative z-10">
                <Navbar />

                {/* HERO SECTION */}
                <section className="pt-28 pb-16 px-6">
                    <div className="mx-auto max-w-4xl text-center animate-in fade-in slide-in-from-bottom-8 duration-700">

                        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-1.5 text-xs font-bold text-blue-700 shadow-md backdrop-blur-md">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                            </span>
                            AI-Powered Career Intelligence
                        </div>

                        <h1 className="mb-6 text-5xl font-black tracking-tight text-slate-900 sm:text-7xl drop-shadow-sm">
                            Master Your <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient-x">
                                Job Applications
                            </span>
                        </h1>

                        <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-600 font-medium leading-relaxed">
                            Upload your resume, get instant AI feedback, and track your progress with our advanced dashboard.
                        </p>

                        <div className="flex items-center justify-center gap-4">
                            <Link
                                to="/upload"
                                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-slate-900 px-8 py-4 font-bold text-white shadow-xl transition-all hover:bg-slate-800 hover:scale-105 active:scale-95 hover:shadow-2xl hover:shadow-blue-500/20"
                            >
                                <span>Analyze New Resume</span>
                                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                                {/* Shine Effect */}
                                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* DASHBOARD GRID */}
                <section className="mx-auto max-w-7xl px-6 pb-24">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                            Your Resumes
                            <span className="bg-white text-blue-600 text-xs px-2.5 py-1 rounded-full border border-blue-100 shadow-sm font-bold">
                                {resumes.length}
                            </span>
                        </h2>
                    </div>

                    {loadingResumes ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {[1,2,3].map(i => (
                                <div key={i} className="h-[400px] w-full rounded-3xl bg-white border border-slate-200 shadow-sm animate-pulse" />
                            ))}
                        </div>
                    ) : resumes.length === 0 ? (
                        // Empty State - Made Solid White
                        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-white/60 py-20 backdrop-blur-sm">
                            <div className="mb-4 rounded-full bg-blue-50 p-6 shadow-inner border border-blue-100">
                                <svg className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No resumes yet</h3>
                            <p className="text-slate-500 max-w-sm text-center font-medium">
                                Upload your first resume to unlock AI insights.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                            {/* Render Actual Resumes */}
                            {resumes.map((resume: any, index: number) => (
                                <ResumeCard key={resume.id || index} resume={resume} />
                            ))}

                            {/* "New Analysis" Card - MADE HIGH VISIBILITY */}
                            <Link
                                to="/upload"
                                className="group flex h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-white/80 hover:bg-white backdrop-blur-md transition-all duration-300 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 relative overflow-hidden"
                            >
                                {/* Hover Gradient Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-780 to-purple-600 opacity-800 group-hover:opacity-700 transition-opacity duration-1000" />

                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg shadow-blue-100 border border-blue-50 transition-transform group-hover:scale-110 mb-6 group-hover:rotate-12">
                                        <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    <span className="font-black text-xl text-slate-700 group-hover:text-blue-700 transition-colors">
                                        New Analysis
                                    </span>
                                    <span className="text-sm font-bold text-slate-400 mt-2 group-hover:text-blue-500 transition-colors">
                                        Check another resume
                                    </span>
                                </div>
                            </Link>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}