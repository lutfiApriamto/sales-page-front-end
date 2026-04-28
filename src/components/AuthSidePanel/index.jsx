import { Sparkles } from 'lucide-react';

const AuthSidePanel = ({ title, description, steps }) => {
    return (
        <div className="hidden lg:flex flex-col justify-between flex-1 bg-indigo-700 p-12 relative overflow-hidden">

            <style>{`
                @keyframes floatA {
                    0%   { transform: translate(0px, 0px) scale(1); }
                    33%  { transform: translate(30px, -20px) scale(1.05); }
                    66%  { transform: translate(-20px, 15px) scale(0.95); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                @keyframes floatB {
                    0%   { transform: translate(0px, 0px) scale(1); }
                    33%  { transform: translate(-25px, 20px) scale(0.95); }
                    66%  { transform: translate(20px, -15px) scale(1.05); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                @keyframes floatC {
                    0%   { transform: translate(0px, 0px) scale(1); }
                    50%  { transform: translate(15px, 25px) scale(1.08); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .blob-a { animation: floatA 8s ease-in-out infinite; }
                .blob-b { animation: floatB 10s ease-in-out infinite; }
                .blob-c { animation: floatC 13s ease-in-out infinite; }
            `}</style>

            {/* Animated blobs */}
            <div className="blob-a absolute w-80 h-80 rounded-full bg-white/5 -top-20 -right-20 pointer-events-none" />
            <div className="blob-b absolute w-64 h-64 rounded-full bg-white/5 -bottom-16 -left-16 pointer-events-none" />
            <div className="blob-c absolute w-40 h-40 rounded-full bg-indigo-500/20 top-1/2 -right-10 pointer-events-none" />

            {/* Brand */}
            <div className="flex items-center gap-2.5 relative z-10">
                <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center">
                    <Sparkles className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">
                    SalesGen<span className="text-indigo-300">.ai</span>
                </span>
            </div>

            {/* Content */}
            <div className="relative z-10">
                <h2 className="text-3xl font-extrabold text-white leading-tight mb-4 tracking-tight">
                    {title}
                </h2>
                <p className="text-indigo-300 text-sm leading-relaxed">
                    {description}
                </p>
            </div>

            {/* Steps */}
            <div className="flex flex-col gap-4 relative z-10">
                {steps.map((text, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center text-xs font-bold text-white">
                            {i + 1}
                        </div>
                        <span className="text-indigo-200 text-sm pt-1 leading-relaxed">{text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AuthSidePanel;