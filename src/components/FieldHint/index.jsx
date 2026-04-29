import { useState, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

const FieldHint = ({ content }) => {
    const [pinned, setPinned] = useState(false);
    const [hovered, setHovered] = useState(false);
    const ref = useRef(null);

    // Klik di luar → tutup
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setPinned(false);
            }
        };
        if (pinned) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [pinned]);

    const isVisible = hovered || pinned;

    return (
        <div className="relative inline-flex items-center" ref={ref}>
            <button
                type="button"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={() => setPinned((v) => !v)}
                className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                    pinned
                        ? 'text-indigo-600'
                        : 'text-slate-400 hover:text-indigo-500'
                }`}
            >
                <HelpCircle className="w-4 h-4" />
            </button>

            {/* Bubble */}
            {isVisible && (
                <div className="absolute left-6 top-1/2 -translate-y-1/2 z-50 w-64 animate-in fade-in zoom-in-95 duration-150">
                    {/* Arrow */}
                    <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-800 rotate-45 rounded-sm" />
                    {/* Content */}
                    <div className="relative bg-slate-800 text-white text-xs leading-relaxed rounded-xl px-3.5 py-2.5 shadow-xl">
                        {content}
                        {pinned && (
                            <span className="block mt-1.5 text-slate-400 text-[10px]">
                                Klik ikon untuk menutup
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FieldHint;