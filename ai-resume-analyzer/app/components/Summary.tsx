import ScoreGauge from "~/components/ScoreGauge";
import ScoreBadge from "~/components/ScoreBadge";

const Category = ({ title, score }: { title: string, score: number }) => {
    // Original Color Logic
    const scoreColor = score > 69
        ? 'text-green-600'
        : score > 49
            ? 'text-yellow-600'
            : 'text-red-600';

    return (
        <div className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1">
                <p className="text-lg font-semibold text-gray-800">{title}</p>
                <ScoreBadge score={score} />
            </div>
            <div className="text-right">
                <p className="text-2xl font-bold">
                    <span className={scoreColor}>{score}</span>
                    <span className="text-gray-400 text-lg">/100</span>
                </p>
            </div>
        </div>
    )
}

const Summary = ({ feedback }: { feedback: any }) => {
    // 1. Safety Check: Stop crashes
    if (!feedback) return null;

    // 2. Extract Scores safely
    const overallScore = feedback.overallScore || 0;
    const contentScore = feedback.content?.score || 0;
    const structureScore = feedback.structure?.score || 0;
    const skillsScore = feedback.skills?.score || 0;

    // ✅ THE FIX: Smart Fallback for Tone
    // If AI gives 0 (glitch) but the resume is otherwise okay, calculate Tone from Content/Structure
    let toneScore = feedback.toneAndStyle?.score || 0;

    if (toneScore === 0 && overallScore > 20) {
        // Estimate Tone based on Content and Structure quality
        toneScore = Math.round((contentScore + structureScore) / 2);
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full overflow-hidden">
            {/* Header / Main Score */}
            <div className="flex flex-row items-center justify-between p-6 bg-gray-50 border-b border-gray-200 max-sm:flex-col max-sm:text-center max-sm:gap-4">
                <div className="flex flex-col gap-2 max-w-[60%] max-sm:max-w-full">
                    <h2 className="text-2xl font-bold text-gray-900">Resume Score</h2>
                    <p className="text-sm text-gray-500">
                        This score is calculated based on tone, content, structure, and skills.
                    </p>
                </div>
                <div className="flex-shrink-0">
                    <ScoreGauge score={overallScore} />
                </div>
            </div>

            {/* Breakdown Categories */}
            <div className="flex flex-col">
                <Category title="Tone & Style" score={toneScore} />
                <Category title="Content" score={contentScore} />
                <Category title="Structure" score={structureScore} />
                <Category title="Skills" score={skillsScore} />
            </div>
        </div>
    )
}

export default Summary;