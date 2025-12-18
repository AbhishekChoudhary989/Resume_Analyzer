import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { LogIn, UserPlus, Mail, Lock, Sparkles } from "lucide-react";

// ✅ CONFIG: Points to your local Node.js server
const API_URL = "http://localhost:5000/api/auth";

export const meta = () => ([
    { title: 'AI CareerBoost | Secure Access' },
])

const Auth = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Form State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchParams = new URLSearchParams(location.search);
    const next = searchParams.get('next') || '/';

    // ✅ SESSION CHECK
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) navigate(next);
    }, [navigate, next]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate(next);
            } else {
                setError(data.message || "Authorization Failed");
            }
        } catch (err) {
            setError("Neural Server Connection Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative min-h-screen w-full bg-slate-950 flex items-center justify-center p-6 overflow-hidden bg-grid-white/[0.05]">

            {/* --- ANIMATED BACKGROUND BLOBS --- */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-indigo-600/30 blur-[120px] animate-[pulse_8s_infinite]" />
                <div className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-purple-600/30 blur-[120px] animate-[pulse_10s_infinite_2s]" />
            </div>

            <div className="relative z-10 w-full max-w-md animate-[fadeIn_0.8s_ease-out]">
                {/* Logo / Branding */}
                <div className="text-center mb-8">
                    <div className="relative inline-flex mb-4 group">
                        {/* Orbiting Ring Animation */}
                        <div className="absolute -inset-2 rounded-2xl border-2 border-dashed border-indigo-400/50 animate-[spin_10s_linear_infinite]" />

                        <div className="relative inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-xl transition-transform duration-500 group-hover:scale-110 shadow-indigo-500/20">
                            <Sparkles className="h-8 w-8 text-white" />
                        </div>
                    </div>

                    <h1 className="text-4xl font-extrabold text-white tracking-tight">
                        Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Back</span>
                    </h1>
                    <p className="text-slate-400 mt-2 font-medium tracking-wide uppercase text-[10px]">Neural Protocol Authorization</p>
                </div>

                {/* Glassmorphic Login Card */}
                <div className="bg-slate-900/60 backdrop-blur-xl rounded-[3rem] shadow-2xl border border-slate-800/50 p-8 md:p-10 transition-all duration-500 hover:shadow-indigo-500/10">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Error Alert */}
                        {error && (
                            <div className="p-3 bg-red-950/50  text-red-300 text-xs rounded-xl text-center font-bold animate-shake">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Identity Handle</label>
                            <div className="relative">
                                {/* CHANGED: Icon is centered better for taller input */}
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 pointer-events-none" />

                                {/* CHANGED: Increased 'py-5' (taller) and 'pl-14' (icon spacing) */}
                                <input
                                    className="w-full pl-100 pr-6 py-5 rounded-2xl border border-slate-800 bg-slate-950/50 text-white focus:bg-slate-950 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600 text-sm font-medium shadow-inner"
                                    type="email"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[14px] font-black uppercase tracking-widest text-slate-400 ml-1">Access Code</label>
                            <div className="relative">
                                {/* CHANGED: Icon position */}
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 pointer-events-none" />

                                {/* CHANGED: Increased 'py-5' (taller) and 'pl-14' */}
                                <input
                                    className=" bg-slate-950/50 text-white focus:bg-slate-950 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600 text-sm font-medium shadow-inner"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            className="group relative w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-5 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 overflow-hidden mt-2"
                            type="submit"
                            disabled={loading}
                        >
                            {/* Shimmer Reflection Animation */}
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />

                            {loading ? (
                                <div className="flex items-center justify-center gap-3">
                                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Verifying Identity...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <span>Launch Dashboard</span>
                                    <LogIn className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </div>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col items-center gap-4">
                        <p className="text-sm text-slate-400">New to the system?</p>
                        <button className="flex items-center gap-2 text-indigo-400 font-bold hover:text-indigo-300 transition-colors group/btn">
                            <UserPlus className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                            <span>Create Access Link</span>
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <button className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors">
                        Recover Access Key
                    </button>
                </div>
            </div>
        </main>
    )
}

export default Auth;