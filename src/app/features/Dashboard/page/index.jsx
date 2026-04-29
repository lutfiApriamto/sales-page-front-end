import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Eye, Trash2, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/components/layouts';
import { axiosService } from '@/utils/axiosConst'; 
import toast from 'react-hot-toast';

const DashboardPage = () => {
    const [salesPages, setSalesPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchHistory = async () => {
        try {
            const res = await axiosService.get('/sales-pages');
            setSalesPages(res.data.data ?? []);
        } catch {
            toast.error('Gagal memuat riwayat sales page.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Yakin ingin menghapus sales page ini?')) return;
        try {
            await axiosService.delete(`/sales-pages/${id}`);
            toast.success('Sales page berhasil dihapus.');
            setSalesPages((prev) => prev.filter((p) => p.id !== id));
        } catch {
            toast.error('Gagal menghapus sales page.');
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric',
        });
    };

    return (
        <ContentLayout
            title="Sales Page Saya"
            description="Kelola semua sales page yang telah Anda generate."
            action={
                <Button
                    onClick={() => navigate('/generate')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                >
                    <PlusCircle className="w-4 h-4" />
                    Buat Sales Page Baru
                </Button>
            }
        >
            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-24">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                </div>
            )}

            {/* Empty State */}
            {!loading && salesPages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">
                        Belum ada sales page
                    </h3>
                    <p className="text-sm text-slate-400 mb-6 max-w-xs">
                        Mulai generate sales page pertama Anda dengan mengisi form spesifikasi produk.
                    </p>
                    <Button
                        onClick={() => navigate('/generate')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                    >
                        <PlusCircle className="w-4 h-4" />
                        Buat Sekarang
                    </Button>
                </div>
            )}

            {/* Table */}
            {!loading && salesPages.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50">
                                    <th className="text-left px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Nama Produk
                                    </th>
                                    <th className="text-left px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                                        Tanggal Dibuat
                                    </th>
                                    <th className="text-right px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {salesPages.map((page) => (
                                    <tr key={page.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-semibold text-slate-900 truncate max-w-50 lg:max-w-xs">
                                                    {page.product_name}
                                                </p>
                                                {page.target_audience && (
                                                    <p className="text-xs text-slate-400 mt-0.5 truncate max-w-50">
                                                        {page.target_audience}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 hidden sm:table-cell">
                                            {formatDate(page.created_at)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => navigate(`/sales-page/${page.id}`)}
                                                    className="gap-1.5 text-xs"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    Lihat
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleDelete(page.id)}
                                                    className="gap-1.5 text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    Hapus
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </ContentLayout>
    );
};

export default DashboardPage;