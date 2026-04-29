import { Loader2 } from 'lucide-react';

const PreviewFrame = ({ htmlContent, viewMode, iframeLoading, onIframeLoad }) => (
    <div className="bg-slate-200 rounded-2xl p-4 flex justify-center min-h-150 relative">
        {iframeLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-slate-200 z-10">
                <Loader2 className="w-7 h-7 animate-spin text-indigo-500" />
                <p className="text-sm text-slate-500 font-medium">Merender hasil AI...</p>
            </div>
        )}
        <div className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
            viewMode === 'mobile' ? 'w-97.5' : 'w-full'
        }`}>
            {htmlContent && (
                <iframe
                    srcDoc={htmlContent}
                    onLoad={onIframeLoad}
                    className="w-full border-0"
                    style={{ height: '700px' }}
                    title="Sales Page Preview"
                    sandbox="allow-scripts"
                />
            )}
        </div>
    </div>
);

export default PreviewFrame;