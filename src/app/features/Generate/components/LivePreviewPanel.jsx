import { useState } from 'react';
import { Monitor, Smartphone, Square, ExternalLink, Download, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PreviewFrame from '@/app/features/SalesPageDetail/components/PreviewFrame';

const LivePreviewPanel = ({ htmlContent, isStreaming, hasResult, onStop, onOpenDetail, onExport }) => {
  const [viewMode, setViewMode] = useState('desktop');

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-900">Live Preview</span>
          {isStreaming && (
            <span className="inline-flex items-center gap-1.5 text-xs text-indigo-600 font-medium">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              AI sedang menulis...
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={() => setViewMode('desktop')} title="Tampilan desktop" aria-label="Tampilan desktop"
            className={`p-1.5 rounded-lg ${viewMode === 'desktop' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400'}`}>
            <Monitor className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => setViewMode('mobile')} title="Tampilan mobile" aria-label="Tampilan mobile"
            className={`p-1.5 rounded-lg ${viewMode === 'mobile' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400'}`}>
            <Smartphone className="w-4 h-4" />
          </button>
        </div>
      </div>

      {htmlContent ? (
        <PreviewFrame htmlContent={htmlContent} viewMode={viewMode} iframeLoading={false} onIframeLoad={() => {}} />
      ) : (
        <div className="bg-slate-100 rounded-2xl min-h-150 flex flex-col items-center justify-center text-slate-400 gap-2">
          <Sparkles className="w-8 h-8" />
          <p className="text-sm font-medium">Hasil sales page akan muncul di sini</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {isStreaming && (
          <Button type="button" variant="outline" onClick={onStop} className="gap-1.5 border-slate-300 text-slate-700 font-bold">
            <Square className="w-4 h-4" /> Stop
          </Button>
        )}
        {hasResult && !isStreaming && (
          <>
            <Button type="button" onClick={onOpenDetail} className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
              <ExternalLink className="w-4 h-4" /> Buka Detail
            </Button>
            <Button type="button" variant="outline" onClick={onExport} className="gap-1.5 border-slate-300 text-slate-700 font-bold">
              <Download className="w-4 h-4" /> Export HTML
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default LivePreviewPanel;
