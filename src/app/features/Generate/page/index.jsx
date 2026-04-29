import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Plus, X, Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '../../../../components/layouts';
import { FieldHint } from '../../../../components';
import { generateSalesPage } from '../api';
import { axiosService } from '@/utils/axiosConst';
import { useAuthStore } from '../../Login/store';
import toast from 'react-hot-toast';

const hints = {
    product_name: 'Masukkan nama produk atau layanan Anda secara lengkap. Contoh: "SalesGen AI — Generator Sales Page Otomatis". Nama yang jelas membantu AI membuat headline yang tepat.',
    description: 'Jelaskan produk Anda secara detail — apa fungsinya, masalah apa yang diselesaikan, dan mengapa pelanggan membutuhkannya. Semakin detail, semakin baik hasil AI.',
    features: 'Tambahkan fitur-fitur unggulan produk Anda satu per satu. Tekan Enter atau klik Tambah setelah setiap fitur. Contoh: "Dashboard Analytics Real-time", "Export ke PDF".',
    target_audience: 'Siapa yang menjadi target pasar produk Anda? Contoh: "Pengusaha UMKM", "Freelancer desainer grafis", "Startup SaaS B2B". Ini membantu AI menyesuaikan tone copywriting.',
    price: 'Masukkan informasi harga produk Anda. Contoh: "Rp 299.000/bulan", "Mulai dari $9/bulan", atau "Hubungi kami untuk harga enterprise".',
    unique_selling_points: 'Apa yang membuat produk Anda berbeda atau lebih baik dari kompetitor? Contoh: "Satu-satunya tools dengan integrasi Gemini AI", "Garansi uang kembali 30 hari".',
};

const GeneratePage = () => {
    const navigate = useNavigate();
    const { user, setAuth } = useAuthStore();
    
    const [isCheckingCredit, setIsCheckingCredit] = useState(true);
    const [hasEnoughCredit, setHasEnoughCredit] = useState(true);
    const [loading, setLoading] = useState(false);
    const [featureInput, setFeatureInput] = useState('');
    const [formData, setFormData] = useState({
        product_name: '',
        description: '',
        features: [],
        target_audience: '',
        price: '',
        unique_selling_points: '',
    });

    useEffect(() => {
        const checkUserCredit = async () => {
            try {
                const res = await axiosService.get('/profile');
                if (res.data?.status === 'success') {
                    const latestUser = res.data.data;
                    
                    const currentToken = localStorage.getItem('auth_token');
                    setAuth(latestUser, currentToken); 

                    if (latestUser.credits <= 0) {
                        setHasEnoughCredit(false);
                    }
                }
            } catch (error) {
                console.error("Gagal sinkronisasi credit", error);
            } finally {
                setIsCheckingCredit(false);
            }
        };

        checkUserCredit();
    }, [setAuth]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addFeature = () => {
        const trimmed = featureInput.trim();
        if (!trimmed) return;
        if (formData.features.includes(trimmed)) {
            toast.error('Fitur sudah ditambahkan.');
            return;
        }
        setFormData({ ...formData, features: [...formData.features, trimmed] });
        setFeatureInput('');
    };

    const removeFeature = (index) => {
        setFormData({
            ...formData,
            features: formData.features.filter((_, i) => i !== index),
        });
    };

    const handleFeatureKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addFeature();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.product_name.trim()) {
            toast.error('Nama produk wajib diisi.');
            return;
        }
        if (!formData.description.trim()) {
            toast.error('Deskripsi produk wajib diisi.');
            return;
        }
        setLoading(true);
        const toastId = toast.loading('AI sedang meracik sales page Anda... Mohon tunggu.');
        try {
            const res = await generateSalesPage(formData);
            
            if (res.sisa_credit !== undefined) {
                const updatedUser = { ...user, credits: res.sisa_credit };
                const currentToken = localStorage.getItem('auth_token');
                setAuth(updatedUser, currentToken);
            }

            toast.dismiss(toastId);
            toast.success('Sales page berhasil di-generate!');
            navigate(`/sales-page/${res.data.id}`);
        } catch (err) {
            toast.dismiss(toastId);
            toast.error(err.response?.data?.message || 'Gagal generate sales page. Coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full px-3.5 py-2.5 border-2 border-slate-200 rounded-xl text-sm text-slate-900 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-400";

    const Label = ({ htmlFor, required, children, hintKey }) => (
        <div className="flex items-center gap-1.5 mb-1.5">
            <label htmlFor={htmlFor} className="text-xs font-semibold text-slate-700">
                {children}
                {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <FieldHint content={hints[hintKey]} />
        </div>
    );

    // Tampilan saat mengecek credit API
    if (isCheckingCredit) {
        return (
            <ContentLayout title="Buat Sales Page Baru" description="Menyiapkan AI workspace Anda...">
                <div className="flex flex-col items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
                    <p className="text-sm text-slate-500 font-medium">Memeriksa sisa kuota API...</p>
                </div>
            </ContentLayout>
        );
    }

    // Tampilan saat Credit Habis (Digembok)
    if (!hasEnoughCredit) {
        return (
            <ContentLayout 
                title="Akses Ditangguhkan" 
                description="Batas limit penggunaan AI Generator."
            >
                <div className="max-w-2xl mx-auto mt-10 bg-white rounded-3xl border border-slate-200 shadow-sm p-10 text-center animate-in zoom-in-95 duration-300">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">AI Credits Habis</h2>
                    <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-md mx-auto">
                        Anda telah menggunakan seluruh batas <strong className="text-slate-700">35 credit demo</strong> yang diberikan. Karena ini adalah versi purwarupa (prototype), silakan hubungi administrator jika Anda memerlukan tambahan kuota untuk pengujian lebih lanjut.
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <Button onClick={() => navigate('/dashboard')} variant="outline" className="font-bold border-slate-300 text-slate-700 px-8">
                            Kembali ke Dashboard
                        </Button>
                    </div>
                </div>
            </ContentLayout>
        );
    }

    // Tampilan Form Normal (Jika Credit > 0)
    return (
        <ContentLayout
            title="Buat Sales Page Baru"
            description="Isi detail produk Anda dan biarkan AI meracik sales page yang persuasif."
        >
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT */}
                    <div className="lg:col-span-2 space-y-5">
                        {/* Card 1 — Informasi Dasar */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                            <div>
                                <h2 className="text-sm font-bold text-slate-900 mb-0.5">Informasi Dasar</h2>
                                <p className="text-xs text-slate-400">Detail utama produk atau layanan Anda</p>
                            </div>

                            <div>
                                <Label htmlFor="product_name" required hintKey="product_name">Nama Produk / Layanan</Label>
                                <input id="product_name" name="product_name" type="text" placeholder="cth: SalesGen AI — Generator Sales Page Otomatis" required disabled={loading} value={formData.product_name} onChange={handleChange} className={inputClass} />
                            </div>

                            <div>
                                <Label htmlFor="description" required hintKey="description">Deskripsi Produk</Label>
                                <textarea id="description" name="description" rows={4} placeholder="Jelaskan produk Anda secara detail — apa yang dilakukan, masalah apa yang diselesaikan..." required disabled={loading} value={formData.description} onChange={handleChange} className={`${inputClass} resize-none`} />
                                <p className="text-xs text-slate-400 mt-1">Semakin detail deskripsi, semakin baik hasil AI.</p>
                            </div>

                            <div>
                                <Label htmlFor="target_audience" hintKey="target_audience">Target Audiens</Label>
                                <input id="target_audience" name="target_audience" type="text" placeholder="cth: Pengusaha UMKM, Freelancer, Startup B2B" disabled={loading} value={formData.target_audience} onChange={handleChange} className={inputClass} />
                            </div>
                        </div>

                        {/* Card 2 — Fitur Utama */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-sm font-bold text-slate-900 mb-0.5">Fitur Utama</h2>
                                    <p className="text-xs text-slate-400">Tambahkan fitur satu per satu lalu tekan Enter atau klik Tambah</p>
                                </div>
                                <FieldHint content={hints.features} />
                            </div>

                            <div className="flex gap-2">
                                <input type="text" placeholder="cth: Generate otomatis dengan AI" disabled={loading} value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} onKeyDown={handleFeatureKeyDown} className={`${inputClass} flex-1`} />
                                <Button type="button" variant="outline" onClick={addFeature} disabled={loading || !featureInput.trim()} className="shrink-0 gap-1.5">
                                    <Plus className="w-4 h-4" />
                                    Tambah
                                </Button>
                            </div>

                            {formData.features.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {formData.features.map((feature, i) => (
                                        <span key={i} className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full border border-indigo-100">
                                            {feature}
                                            <button type="button" onClick={() => removeFeature(i)} disabled={loading} className="hover:text-indigo-900 transition-colors">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-slate-400 italic">Belum ada fitur yang ditambahkan.</p>
                            )}
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="space-y-5">
                        {/* Card 3 — Harga & USP */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                            <div>
                                <h2 className="text-sm font-bold text-slate-900 mb-0.5">Harga & Keunggulan</h2>
                                <p className="text-xs text-slate-400">Informasi harga dan nilai jual unik produk</p>
                            </div>

                            <div>
                                <Label htmlFor="price" hintKey="price">Harga</Label>
                                <input id="price" name="price" type="text" placeholder="cth: Rp 299.000 / bulan" disabled={loading} value={formData.price} onChange={handleChange} className={inputClass} />
                            </div>

                            <div>
                                <Label htmlFor="unique_selling_points" hintKey="unique_selling_points">Unique Selling Points</Label>
                                <textarea id="unique_selling_points" name="unique_selling_points" rows={4} placeholder="Apa yang membuat produk Anda berbeda dari kompetitor?..." disabled={loading} value={formData.unique_selling_points} onChange={handleChange} className={`${inputClass} resize-none`} />
                            </div>
                        </div>

                        {/* Card 4 — Submit */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                            <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                                <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-indigo-700 leading-relaxed">
                                    AI akan memproses data Anda dan menghasilkan sales page lengkap dalam <strong>30–60 detik</strong>.
                                </p>
                            </div>

                            <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 gap-2">
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        AI sedang bekerja...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        Generate Sales Page
                                    </>
                                )}
                            </Button>

                            <Button type="button" variant="outline" disabled={loading} onClick={() => navigate('/dashboard')} className="w-full text-slate-600 font-bold border-slate-300">
                                Batal
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </ContentLayout>
    );
};

export default GeneratePage;