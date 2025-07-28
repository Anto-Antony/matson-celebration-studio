import { ReactNode } from "react";

const Background: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-100 relative overflow-hidden">
            {/* Enhanced Vibrant Background Decorative Elements */}
            <div className="fixed inset-0 opacity-40 pointer-events-none">
                {/* Large vibrant floating circles */}
                <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-rose-300/60 to-pink-400/60 rounded-full blur-3xl md:animate-pulse md:floating-animation"></div>
                <div className="absolute top-1/4 right-16 w-80 h-80 bg-gradient-to-br from-violet-400/50 to-purple-500/50 rounded-full blur-3xl md:animate-pulse delay-1000 md:floating-animation"></div>
                <div className="absolute bottom-1/3 left-1/4 w-[28rem] h-[28rem] bg-gradient-to-br from-fuchsia-300/40 to-rose-400/40 rounded-full blur-3xl md:animate-pulse delay-2000"></div>
                <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-gradient-to-br from-indigo-400/50 to-blue-500/50 rounded-full blur-3xl md:animate-pulse delay-500 md:floating-animation"></div>

                {/* Medium colorful floating shapes */}
                <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-gradient-to-br from-emerald-300/60 to-teal-400/60 rounded-full blur-2xl md:animate-bounce md:floating-animation"></div>
                <div className="absolute top-3/4 left-10 w-40 h-40 bg-gradient-to-br from-amber-300/60 to-orange-400/60 rounded-full blur-xl md:animate-bounce delay-300 md:floating-animation"></div>
                <div className="absolute top-10 right-1/3 w-56 h-56 bg-gradient-to-br from-cyan-300/50 to-blue-400/50 rounded-full blur-2xl md:animate-bounce delay-700 md:floating-animation"></div>
                <div className="absolute bottom-1/2 right-10 w-44 h-44 bg-gradient-to-br from-lime-300/60 to-green-400/60 rounded-full blur-xl md:animate-bounce delay-1200 md:floating-animation"></div>

                {/* Small vibrant floating dots */}
                <div className="absolute top-1/3 left-3/4 w-20 h-20 bg-gradient-to-br from-pink-400/80 to-rose-500/80 rounded-full blur-sm md:animate-spin-slow md:floating-animation"></div>
                <div className="absolute bottom-1/2 right-10 w-16 h-16 bg-gradient-to-br from-purple-400/80 to-indigo-500/80 rounded-full blur-sm md:animate-spin-slow md:floating-animation delay-1000"></div>
                <div className="absolute top-2/3 left-20 w-24 h-24 bg-gradient-to-br from-blue-400/70 to-cyan-500/70 rounded-full blur-md md:animate-spin-slow md:floating-animation delay-500"></div>
                <div className="absolute top-40 left-1/3 w-18 h-18 bg-gradient-to-br from-emerald-400/80 to-teal-500/80 rounded-full blur-sm md:animate-spin-slow md:floating-animation delay-800"></div>
                <div className="absolute bottom-40 right-1/3 w-14 h-14 bg-gradient-to-br from-amber-400/80 to-orange-500/80 rounded-full blur-sm md:animate-spin-slow md:floating-animation delay-1500"></div>

                {/* Additional slow-moving blurred background elements */}
                <div className="absolute top-32 left-20 w-64 h-64 bg-gradient-to-br from-rose-200/40 to-pink-300/40 rounded-full blur-3xl md:floating-animation-slow"></div>
                <div className="absolute top-60 right-32 w-52 h-52 bg-gradient-to-br from-purple-200/40 to-violet-300/40 rounded-full blur-3xl md:floating-animation-slow delay-1000"></div>
                <div className="absolute bottom-32 left-32 w-72 h-72 bg-gradient-to-br from-blue-200/40 to-indigo-300/40 rounded-full blur-3xl md:floating-animation-slow delay-2000"></div>
                <div className="absolute bottom-60 right-20 w-60 h-60 bg-gradient-to-br from-teal-200/40 to-cyan-300/40 rounded-full blur-3xl md:floating-animation-slow delay-3000"></div>
                <div className="absolute top-1/2 left-10 w-48 h-48 bg-gradient-to-br from-emerald-200/40 to-green-300/40 rounded-full blur-3xl md:floating-animation-slow delay-1500"></div>
                <div className="absolute top-1/3 right-10 w-56 h-56 bg-gradient-to-br from-amber-200/40 to-yellow-300/40 rounded-full blur-3xl md:floating-animation-slow delay-2500"></div>
                <div className="absolute bottom-1/4 left-1/2 w-68 h-68 bg-gradient-to-br from-fuchsia-200/40 to-pink-300/40 rounded-full blur-3xl md:floating-animation-slow delay-500"></div>
                <div className="absolute top-3/4 right-1/2 w-44 h-44 bg-gradient-to-br from-lavender-200/40 to-purple-300/40 rounded-full blur-3xl md:floating-animation-slow delay-3500"></div>

                {/* Extra large slow-moving elements for depth */}
                <div className="absolute top-0 left-1/3 w-[32rem] h-[32rem] bg-gradient-to-br from-rose-100/30 to-pink-200/30 rounded-full blur-[4rem] md:floating-animation-slow"></div>
                <div className="absolute bottom-0 right-1/3 w-[36rem] h-[36rem] bg-gradient-to-br from-purple-100/30 to-violet-200/30 rounded-full blur-[4rem] md:floating-animation-slow delay-4000"></div>
                <div className="absolute top-1/2 left-0 w-[28rem] h-[28rem] bg-gradient-to-br from-blue-100/30 to-indigo-200/30 rounded-full blur-[4rem] md:floating-animation-slow delay-2000"></div>
                <div className="absolute bottom-1/2 right-0 w-[30rem] h-[30rem] bg-gradient-to-br from-teal-100/30 to-cyan-200/30 rounded-full blur-[4rem] md:floating-animation-slow delay-3000"></div>

                {/* Medium-sized slow orbital elements */}
                <div className="absolute top-1/4 left-1/2 w-40 h-40 bg-gradient-to-br from-orange-200/50 to-red-300/50 rounded-full blur-2xl md:orbital-animation"></div>
                <div className="absolute bottom-1/4 right-1/2 w-36 h-36 bg-gradient-to-br from-green-200/50 to-emerald-300/50 rounded-full blur-2xl md:orbital-animation delay-2000"></div>
                <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-gradient-to-br from-blue-200/50 to-sky-300/50 rounded-full blur-2xl md:orbital-animation delay-4000"></div>
                <div className="absolute bottom-1/2 left-1/4 w-38 h-38 bg-gradient-to-br from-violet-200/50 to-purple-300/50 rounded-full blur-2xl md:orbital-animation delay-1000"></div>

                {/* Geometric slow-moving blurred shapes */}
                <div className="absolute top-40 right-40 w-32 h-32 bg-gradient-to-br from-violet-400/60 to-purple-500/60 transform rotate-45 blur-xl md:animate-spin-slow md:floating-animation"></div>
                <div className="absolute bottom-40 left-40 w-28 h-28 bg-gradient-to-br from-rose-400/60 to-pink-500/60 transform rotate-12 blur-lg md:animate-pulse md:floating-animation"></div>
                <div className="absolute top-1/2 right-1/4 w-36 h-36 bg-gradient-to-br from-indigo-400/50 to-blue-500/50 transform -rotate-12 blur-xl md:animate-spin-slow delay-1000"></div>
                <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-gradient-to-br from-cyan-400/70 to-teal-500/70 transform rotate-45 blur-md md:animate-pulse delay-700"></div>

                {/* Additional slow-moving blurred rectangles and ovals */}
                <div className="absolute top-16 left-1/2 w-32 h-20 bg-gradient-to-r from-pink-200/40 to-rose-300/40 rounded-full blur-2xl md:floating-animation-slow transform rotate-12"></div>
                <div className="absolute bottom-16 right-1/2 w-28 h-16 bg-gradient-to-r from-purple-200/40 to-violet-300/40 rounded-full blur-2xl md:floating-animation-slow delay-2000 transform -rotate-12"></div>
                <div className="absolute top-1/3 left-16 w-24 h-40 bg-gradient-to-b from-blue-200/40 to-indigo-300/40 rounded-full blur-2xl md:floating-animation-slow delay-1000 transform rotate-45"></div>
                <div className="absolute bottom-1/3 right-16 w-20 h-36 bg-gradient-to-b from-teal-200/40 to-cyan-300/40 rounded-full blur-2xl md:floating-animation-slow delay-3000 transform -rotate-45"></div>

                {/* Streak effects - slower and more blurred */}
                <div className="absolute top-1/4 left-1/2 w-2 h-32 bg-gradient-to-b from-pink-300/30 to-transparent blur-md md:floating-animation-slow delay-300"></div>
                <div className="absolute bottom-1/4 right-1/2 w-2 h-28 bg-gradient-to-t from-purple-300/30 to-transparent blur-md md:floating-animation-slow delay-800"></div>
                <div className="absolute top-1/2 left-1/4 w-24 h-2 bg-gradient-to-r from-blue-300/30 to-transparent blur-md md:floating-animation-slow delay-1100"></div>
                <div className="absolute bottom-1/2 right-1/4 w-20 h-2 bg-gradient-to-l from-teal-300/30 to-transparent blur-md md:floating-animation-slow delay-1400"></div>
            </div>
            {children}
        </div>
    );
};

export default Background;
