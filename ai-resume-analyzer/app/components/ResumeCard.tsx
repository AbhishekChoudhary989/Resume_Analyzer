import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";

const BACKEND_URL = "http://localhost:5000";

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath } }: { resume: any }) => {

    const getImageUrl = (path: string) => {
        if (!path) return "";
        if (path.startsWith("http")) return path;
        const cleanPath = path.replace(/\\/g, "/");
        const formattedPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
        return `${BACKEND_URL}${formattedPath}`;
    };

    const score = feedback?.overallScore || 0;

    // Determine status color
    const statusColor = score > 70 ? "bg-green-500" : score > 50 ? "bg-yellow-500" : "bg-red-500";
    const glowColor = score > 70 ? "group-hover:shadow-green-500/20" : score > 50 ? "group-hover:shadow-yellow-500/20" : "group-hover:shadow-red-500/20";

    return (
        <Link
            to={`/resume/${id}`}
            className={`group relative flex flex-col rounded-3xl bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${glowColor} ring-1 ring-gray-900/5 overflow-hidden h-[400px]`}
        >
            {/* Image Section - Takes up most space */}
            <div className="relative h-full w-full overflow-hidden bg-gray-100">
                {imagePath ? (
                    <img
                        src={getImageUrl(imagePath)}
                        alt="Resume"
                        className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <span className="text-gray-300 text-4xl font-light">PDF</span>
                    </div>
                )}

                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                {/* Status Dot */}
                <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 backdrop-blur-md ring-1 ring-white/20">
                    <div className={`h-2 w-2 rounded-full ${statusColor} shadow-[0_0_10px_currentColor]`} />
                    <span className="text-xs font-medium text-white tracking-wide">
                        {score > 70 ? 'STRONG' : score > 50 ? 'AVERAGE' : 'WEAK'}
                    </span>
                </div>
            </div>

            {/* Floating Info Card (Glassmorphism) */}
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/90 p-4 shadow-lg backdrop-blur-xl ring-1 ring-white/50 transition-all duration-300 group-hover:bg-white">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col overflow-hidden">
                        <h3 className="truncate text-lg font-bold text-gray-900">
                            {companyName || "Untitled Application"}
                        </h3>
                        <p className="truncate text-sm font-medium text-gray-500">
                            {jobTitle || "Resume Analysis"}
                        </p>
                    </div>

                    {/* Score Gauge */}
                    <div className="flex-shrink-0">
                        <div className="relative flex items-center justify-center">
                            <ScoreCircle score={score} size={48} stroke={4} />
                        </div>
                    </div>
                </div>

                {/* Hidden "View" text that appears on hover */}
                <div className="mt-0 h-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:mt-3 group-hover:h-auto group-hover:opacity-100">
                    <div className="flex w-full items-center justify-center rounded-xl bg-gray-900 py-2 text-xs font-bold uppercase tracking-wider text-white transition-transform active:scale-95">
                        View Feedback
                    </div>
                </div>
            </div>
        </Link>
    )
}
export default ResumeCard;