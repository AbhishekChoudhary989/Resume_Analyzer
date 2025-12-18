const ScoreGauge = ({ score = 0 }: { score: number }) => {
    // Gauge Math
    // We want a 180 degree arc (half circle)
    // Radius = 40, Stroke = 10
    const radius = 40;
    const circumference = Math.PI * radius; // Half circumference
    const progress = Math.min(Math.max(score, 0), 100) / 100;
    const strokeDashoffset = circumference * (1 - progress);

    return (
        <div className="relative flex flex-col items-center justify-center w-48">
            {/* SVG ViewBox adjusted for half-circle aspect ratio */}
            <svg viewBox="0 0 100 55" className="w-full h-auto overflow-visible">
                <defs>
                    <linearGradient
                        id="gaugeGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                    >
                        <stop offset="0%" stopColor="#FF97AD" />
                        <stop offset="100%" stopColor="#5171FF" />
                    </linearGradient>
                </defs>

                {/* Background track */}
                <path
                    d="M10,50 A40,40 0 0,1 90,50"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="10"
                    strokeLinecap="round"
                />

                {/* Progress Arc */}
                <path
                    d="M10,50 A40,40 0 0,1 90,50"
                    fill="none"
                    stroke="url(#gaugeGradient)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000 ease-out"
                />
            </svg>

            <div className="absolute bottom-0 flex flex-col items-center translate-y-2">
                <span className="text-4xl font-bold text-gray-800">{score}</span>
                <span className="text-sm text-gray-500 font-medium">/ 100</span>
            </div>
        </div>
    );
};

export default ScoreGauge;