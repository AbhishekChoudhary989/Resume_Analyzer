import { Link, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { LogOut, Sparkles } from "lucide-react";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState<{ name?: string; email: string } | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (token && userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
            } catch (e) {
                // If data is corrupt, clear it
                localStorage.removeItem("user");
                setUser(null);
            }
        } else {
            setUser(null);
        }
    }, [location]);

    const handleSignOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/auth");
    };

    // Safe Name Helper
    const getInitial = () => {
        if (user && user.name) return user.name.charAt(0).toUpperCase();
        if (user && user.email) return user.email.charAt(0).toUpperCase();
        return "U";
    };

    const getDisplayName = () => {
        if (user && user.name) return user.name.split(" ")[0];
        if (user && user.email) return user.email.split("@")[0];
        return "User";
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 h-[73px]">
            <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">

                {/* Logo Area */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-105">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <span className="text-xl font-black text-slate-900 tracking-tight">
                        AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">CareerBoost</span>
                    </span>
                </Link>

                {/* Right Side Actions */}
                <div className="flex items-center gap-6">
                    {user ? (
                        <div className="flex items-center gap-4 animate-in fade-in">
                            {/* User Avatar / Initial */}
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                                    {/* ✅ SAFE CALL: Uses helper function */}
                                    {getInitial()}
                                </div>
                                <span className="text-sm font-semibold text-slate-700 hidden md:block">
                                    {/* ✅ SAFE CALL: Uses helper function */}
                                    {getDisplayName()}
                                </span>
                            </div>

                            {/* Sign Out Button */}
                            <button
                                onClick={handleSignOut}
                                className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-red-600 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Sign Out</span>
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/auth"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95"
                        >
                            Get Started
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}