import { ArrowLeft, Monitor, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PreviewToolbar = ({ viewMode, onViewModeChange }) => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
                <button
                    onClick={() => onViewModeChange('desktop')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        viewMode === 'desktop'
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <Monitor className="w-3.5 h-3.5" />
                    Desktop
                </button>
                <button
                    onClick={() => onViewModeChange('mobile')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        viewMode === 'mobile'
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <Smartphone className="w-3.5 h-3.5" />
                    Mobile
                </button>
            </div>

            <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="gap-1.5 text-xs text-slate-500"
            >
                <ArrowLeft className="w-3.5 h-3.5" />
                Kembali
            </Button>
        </div>
    );
};

export default PreviewToolbar;