import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, RefreshCw, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '../../../../components/layouts';
import { getSalesPage, regenerateSalesPage, deleteSalesPage } from '../api';
import {
    ConfirmDialog,
    PreviewToolbar,
    PreviewFrame,
    MetaInfo,
} from '../components';
import { buildHtmlDocument } from '../utils';
import toast from 'react-hot-toast';

const SalesPageDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [salesPage, setSalesPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [iframeLoading, setIframeLoading] = useState(true);
    const [regenerating, setRegenerating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [viewMode, setViewMode] = useState('desktop');
    const [htmlContent, setHtmlContent] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [regenerateDialogOpen, setRegenerateDialogOpen] = useState(false);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await getSalesPage(id);
                const page = res.data;
                setSalesPage(page);
                setHtmlContent(buildHtmlDocument(page.ai_generated_content, page.product_name));
            } catch {
                toast.error('Gagal memuat sales page.');
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    const handleExport = () => {
        if (!salesPage) return;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${salesPage.product_name.replace(/\s+/g, '-').toLowerCase()}-sales-page.html`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Sales page berhasil diexport!');
    };

    const handleRegenerate = async () => {
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
            setRegenerateDialogOpen(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteSalesPage(id);
            toast.success('Sales page berhasil dihapus.');
            navigate('/dashboard');
        } catch {
            toast.error('Gagal menghapus sales page.');
        } finally {
            setDeleting(false);
            setDeleteDialogOpen(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                <p className="text-sm text-slate-400">Memuat data sales page...</p>
            </div>
        );
    }

    return (
        <>
            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Hapus Sales Page?"
                description={`Sales page "${salesPage?.product_name}" akan dihapus secara permanen dan tidak dapat dikembalikan.`}
                confirmLabel="Ya, Hapus"
                confirmVariant="destructive"
                onConfirm={handleDelete}
                loading={deleting}
            />

            <ConfirmDialog
                open={regenerateDialogOpen}
                onOpenChange={setRegenerateDialogOpen}
                title="Generate Ulang Sales Page?"
                description={`Hasil sales page "${salesPage?.product_name}" saat ini akan digantikan. Proses ini membutuhkan 30–60 detik.`}
                confirmLabel="Ya, Generate Ulang"
                confirmVariant="default"
                onConfirm={handleRegenerate}
                loading={regenerating}
            />

            <ContentLayout
                title={salesPage?.product_name ?? 'Detail Sales Page'}
                description="Pratinjau hasil generate AI dari sales page Anda."
                action={
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                        <Button size="sm" variant="outline" onClick={handleExport} className="gap-1.5 text-xs">
                            <Download className="w-3.5 h-3.5" />
                            Export HTML
                        </Button>
                        <Button
                            size="sm" variant="outline"
                            onClick={() => setRegenerateDialogOpen(true)}
                            disabled={regenerating}
                            className="gap-1.5 text-xs"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Regenerate
                        </Button>
                        <Button
                            size="sm" variant="outline"
                            onClick={() => setDeleteDialogOpen(true)}
                            className="gap-1.5 text-xs text-red-600 border-red-200 hover:bg-red-50"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            Hapus
                        </Button>
                    </div>
                }
            >
                <PreviewToolbar
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                />

                <PreviewFrame
                    htmlContent={htmlContent}
                    viewMode={viewMode}
                    iframeLoading={iframeLoading}
                    onIframeLoad={() => setIframeLoading(false)}
                />

                <MetaInfo salesPage={salesPage} />
            </ContentLayout>
        </>
    );
};

export default SalesPageDetailPage;