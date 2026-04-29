import { useState, useEffect } from 'react'; // <-- hapus useRef
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Download, RefreshCw, Trash2,
    Monitor, Smartphone, Loader2, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ContentLayout } from '../../../../components/layouts';
import { getSalesPage, regenerateSalesPage, deleteSalesPage } from '../api';
import toast from 'react-hot-toast';

const templates = [
    { id: 'corporate', label: 'Corporate Clean' },
    { id: 'minimalist', label: 'Modern Minimalist' },
];

const getTemplateStyles = (templateId) => {
    if (templateId === 'minimalist') {
        return `
            body { font-family: 'Georgia', serif; color: #1a1a1a; background: #fafafa; }
            h1, h2, h3 { font-weight: 700; letter-spacing: -0.5px; }
            .section { padding: 60px 40px; max-width: 720px; margin: 0 auto; }
            .cta-btn { background: #1a1a1a; color: white; padding: 14px 32px; border-radius: 4px; font-size: 15px; text-decoration: none; display: inline-block; }
            ul { padding-left: 20px; }
            li { margin-bottom: 8px; line-height: 1.7; }
        `;
    }
    return `
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #0f172a; background: #ffffff; }
        h1 { font-size: 2.5rem; font-weight: 800; letter-spacing: -1px; line-height: 1.1; }
        h2 { font-size: 1.5rem; font-weight: 700; }
        h3 { font-size: 1.1rem; font-weight: 600; }
        .section { padding: 64px 48px; max-width: 960px; margin: 0 auto; }
        .cta-btn { background: #4f46e5; color: white; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 15px; text-decoration: none; display: inline-block; }
        ul { padding-left: 20px; }
        li { margin-bottom: 10px; line-height: 1.7; }
        .badge { display: inline-block; background: #eef2ff; color: #4f46e5; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; margin-bottom: 16px; }
    `;
};

const buildHtmlDocument = (content, templateId, productName) => {
    return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>${productName} — Sales Page</title>
    <script src="https://cdn.tailwindcss.com"><\/script>
    <style>${getTemplateStyles(templateId)}</style>
</head>
<body>
${content}
</body>
</html>`;
};

const SalesPageDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [salesPage, setSalesPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [regenerating, setRegenerating] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState('corporate');
    const [viewMode, setViewMode] = useState('desktop');
    const [iframeContent, setIframeContent] = useState(''); // <-- BARU

    const fetchDetail = async () => {
        try {
            const res = await getSalesPage(id);
            setSalesPage(res.data);
        } catch {
            toast.error('Gagal memuat sales page.');
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetail();
    }, [id]);

    // <-- GANTI useEffect lama dengan ini
    useEffect(() => {
        if (!salesPage) return;
        const html = buildHtmlDocument(
            salesPage.ai_generated_content,
            selectedTemplate,
            salesPage.product_name
        );
        setIframeContent(html);
    }, [salesPage, selectedTemplate]);

    const handleExport = () => {
        if (!salesPage) return;
        const html = buildHtmlDocument(
            salesPage.ai_generated_content,
            selectedTemplate,
            salesPage.product_name
        );
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${salesPage.product_name.replace(/\s+/g, '-').toLowerCase()}-sales-page.html`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Sales page berhasil diexport!');
    };

    const handleRegenerate = async () => {
        if (!salesPage) return;
        if (!confirm('Generate ulang sales page ini? Hasil sebelumnya akan digantikan.')) return;
        setRegenerating(true);
        const toastId = toast.loading('AI sedang regenerate... Mohon tunggu.');
        try {
            const res = await regenerateSalesPage(id, {
                product_name: salesPage.product_name,
                description: salesPage.description,
                features: salesPage.features,
                target_audience: salesPage.target_audience,
                price: salesPage.price,
                unique_selling_points: salesPage.unique_selling_points,
            });
            await deleteSalesPage(id);
            toast.dismiss(toastId);
            toast.success('Sales page berhasil di-regenerate!');
            navigate(`/sales-page/${res.data.id}`);
        } catch {
            toast.dismiss(toastId);
            toast.error('Gagal regenerate. Coba lagi.');
        } finally {
            setRegenerating(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Yakin ingin menghapus sales page ini?')) return;
        try {
            await deleteSalesPage(id);
            toast.success('Sales page berhasil dihapus.');
            navigate('/dashboard');
        } catch {
            toast.error('Gagal menghapus sales page.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <ContentLayout
            title={salesPage?.product_name ?? 'Detail Sales Page'}
            description={`Template: ${templates.find(t => t.id === selectedTemplate)?.label}`}
            action={
                <div className="flex items-center gap-2 flex-wrap justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                                <Eye className="w-3.5 h-3.5" />
                                {templates.find(t => t.id === selectedTemplate)?.label}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {templates.map((t) => (
                                <DropdownMenuItem
                                    key={t.id}
                                    onClick={() => setSelectedTemplate(t.id)}
                                    className={selectedTemplate === t.id ? 'bg-indigo-50 text-indigo-700 font-medium' : ''}
                                >
                                    {t.id === selectedTemplate && '✓ '}{t.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button size="sm" variant="outline" onClick={handleExport} className="gap-1.5 text-xs">
                        <Download className="w-3.5 h-3.5" />
                        Export HTML
                    </Button>

                    <Button
                        size="sm" variant="outline" onClick={handleRegenerate}
                        disabled={regenerating} className="gap-1.5 text-xs"
                    >
                        {regenerating
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            : <RefreshCw className="w-3.5 h-3.5" />
                        }
                        Regenerate
                    </Button>

                    <Button
                        size="sm" variant="outline" onClick={handleDelete}
                        className="gap-1.5 text-xs text-red-600 border-red-200 hover:bg-red-50"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        Hapus
                    </Button>
                </div>
            }
        >
            {/* Toolbar Preview */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
                    <button
                        onClick={() => setViewMode('desktop')}
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
                        onClick={() => setViewMode('mobile')}
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
                    variant="ghost" size="sm"
                    onClick={() => navigate('/dashboard')}
                    className="gap-1.5 text-xs text-slate-500"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Kembali
                </Button>
            </div>

            {/* Preview Area */}
            <div className="bg-slate-200 rounded-2xl p-4 flex justify-center min-h-[600px]">
                <div className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
                    viewMode === 'mobile' ? 'w-[390px]' : 'w-full'
                }`}>
                    {/* <-- GANTI iframe lama dengan ini */}
                    <iframe
                        srcDoc={iframeContent}
                        className="w-full border-0"
                        style={{ height: '700px' }}
                        title="Sales Page Preview"
                        sandbox="allow-scripts"
                    />
                </div>
            </div>

            {/* Meta Info */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: 'Produk', value: salesPage?.product_name },
                    { label: 'Target Audiens', value: salesPage?.target_audience || '-' },
                    { label: 'Harga', value: salesPage?.price || '-' },
                    { label: 'Dibuat', value: new Date(salesPage?.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) },
                ].map(({ label, value }) => (
                    <div key={label} className="bg-white rounded-xl border border-slate-100 px-4 py-3">
                        <p className="text-xs text-slate-400 mb-0.5">{label}</p>
                        <p className="text-sm font-semibold text-slate-900 truncate">{value}</p>
                    </div>
                ))}
            </div>
        </ContentLayout>
    );
};

export default SalesPageDetailPage;