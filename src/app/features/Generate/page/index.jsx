import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Plus, X, Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/components/layouts';
import { FieldHint } from '@/components';
import { axiosService } from '@/utils/axiosConst';
import { buildHtmlDocument } from '@/app/features/SalesPageDetail/utils';
import { streamSalesPage } from '../api';
import { ImageUploader, PromptOptions, LivePreviewPanel } from '../components';
import { useAuthStore } from '../../Login/store';
import toast from 'react-hot-toast';

const hints = {
  product_name: 'Masukkan nama produk atau layanan Anda secara lengkap.',
  description: 'Jelaskan produk Anda secara detail — fungsi, masalah yang diselesaikan, dan kenapa pelanggan membutuhkannya.',
  features: 'Tambahkan fitur unggulan satu per satu. Tekan Enter atau klik Tambah.',
  target_audience: 'Siapa target pasar produk Anda?',
  price: 'Masukkan informasi harga produk Anda.',
  unique_selling_points: 'Apa yang membuat produk Anda berbeda dari kompetitor?',
};

const Label = ({ htmlFor, required, children, hintKey }) => (
  <div className="flex items-center gap-1.5 mb-1.5">
    <label htmlFor={htmlFor} className="text-xs font-semibold text-slate-700">
      {children}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    <FieldHint content={hints[hintKey]} />
  </div>
);

const initialOptions = {
  tone: 'professional',
  color_scheme: 'blue',
  custom_color: '#4f46e5',
  sections: { faq: false, guarantee: false, comparison: false, countdown: false },
};

const GeneratePage = () => {
  const navigate = useNavigate();
  const { user, setAuth } = useAuthStore();

  const [isCheckingCredit, setIsCheckingCredit] = useState(true);
  const [hasEnoughCredit, setHasEnoughCredit] = useState(true);
  const [streaming, setStreaming] = useState(false);
  const [featureInput, setFeatureInput] = useState('');
  const [formData, setFormData] = useState({
    product_name: '', description: '', features: [],
    target_audience: '', price: '', unique_selling_points: '',
  });
  const [productImage, setProductImage] = useState(null);
  const [logoImage, setLogoImage] = useState(null);
  const [options, setOptions] = useState(initialOptions);

  const [previewHtml, setPreviewHtml] = useState('');
  const [resultId, setResultId] = useState(null);

  const accumulatedRef = useRef('');     // HTML mentah terkumpul
  const throttleRef = useRef(null);      // interval throttle render
  const abortRef = useRef(null);         // AbortController aktif

  useEffect(() => {
    const checkUserCredit = async () => {
      try {
        const res = await axiosService.get('/profile');
        if (res.data?.status === 'success') {
          const latestUser = res.data.data;
          setAuth(latestUser, localStorage.getItem('auth_token'));
          if (latestUser.credits <= 0) setHasEnoughCredit(false);
        }
      } catch (error) {
        console.error('Gagal sinkronisasi credit', error);
      } finally {
        setIsCheckingCredit(false);
      }
    };
    checkUserCredit();
  }, [setAuth]);

  useEffect(() => () => {
    if (throttleRef.current) clearInterval(throttleRef.current);
    if (abortRef.current) abortRef.current.abort();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const addFeature = () => {
    const trimmed = featureInput.trim();
    if (!trimmed) return;
    if (formData.features.includes(trimmed)) { toast.error('Fitur sudah ditambahkan.'); return; }
    setFormData({ ...formData, features: [...formData.features, trimmed] });
    setFeatureInput('');
  };
  const removeFeature = (index) =>
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });
  const handleFeatureKeyDown = (e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } };

  const buildPayload = () => {
    const payload = {
      ...formData,
      tone: options.tone,
      color_scheme: options.color_scheme,
      sections: options.sections,
    };
    if (options.color_scheme === 'custom') payload.custom_color = options.custom_color;
    if (productImage) payload.image_url = productImage;
    if (logoImage) payload.logo_url = logoImage;
    return payload;
  };

  const startThrottledRender = () => {
    if (throttleRef.current) clearInterval(throttleRef.current);
    throttleRef.current = setInterval(() => {
      if (!accumulatedRef.current) return;
      setPreviewHtml(buildHtmlDocument(accumulatedRef.current, formData.product_name || 'Sales Page'));
    }, 300);
  };
  const stopThrottledRender = () => {
    if (throttleRef.current) { clearInterval(throttleRef.current); throttleRef.current = null; }
  };

  const handleGenerate = async () => {
    if (!formData.product_name.trim()) { toast.error('Nama produk wajib diisi.'); return; }
    if (!formData.description.trim()) { toast.error('Deskripsi produk wajib diisi.'); return; }

    accumulatedRef.current = '';
    setPreviewHtml('');
    setResultId(null);
    setStreaming(true);
    startThrottledRender();

    const controller = new AbortController();
    abortRef.current = controller;

    await streamSalesPage(buildPayload(), {
      token: localStorage.getItem('auth_token'),
      signal: controller.signal,
      onChunk: (chunk) => { accumulatedRef.current += chunk; },
      onDone: (ev) => {
        stopThrottledRender();
        setPreviewHtml(buildHtmlDocument(accumulatedRef.current, formData.product_name || 'Sales Page'));
        setResultId(ev.id);
        setStreaming(false);
        abortRef.current = null;
        if (ev.sisa_credit !== undefined) {
          setAuth({ ...user, credits: ev.sisa_credit }, localStorage.getItem('auth_token'));
        }
        toast.success('Sales page berhasil di-generate!');
      },
      onError: (msg) => {
        stopThrottledRender();
        setStreaming(false);
        abortRef.current = null;
        toast.error(msg || 'Gagal generate sales page.');
      },
    });
  };

  const handleStop = () => {
    if (abortRef.current) abortRef.current.abort();
    stopThrottledRender();
    setStreaming(false);
    abortRef.current = null;
    toast('Generate dihentikan.');
  };

  const handleExport = () => {
    if (!previewHtml) return;
    const blob = new Blob([previewHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(formData.product_name || 'sales-page').replace(/\s+/g, '-').toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Sales page berhasil diexport!');
  };

  const inputClass = "w-full px-3.5 py-2.5 border-2 border-slate-200 rounded-xl text-sm text-slate-900 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-400";

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

  if (!hasEnoughCredit) {
    return (
      <ContentLayout title="Akses Ditangguhkan" description="Batas limit penggunaan AI Generator.">
        <div className="max-w-2xl mx-auto mt-10 bg-white rounded-3xl border border-slate-200 shadow-sm p-10 text-center animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">AI Credits Habis</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-md mx-auto">
            Anda telah menggunakan seluruh batas <strong className="text-slate-700">35 credit demo</strong>. Silakan hubungi administrator untuk tambahan kuota.
          </p>
          <Button onClick={() => navigate('/dashboard')} variant="outline" className="font-bold border-slate-300 text-slate-700 px-8">
            Kembali ke Dashboard
          </Button>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="Buat Sales Page Baru" description="Isi detail produk, atur opsi, dan lihat hasilnya secara real-time.">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* KIRI — Form + opsi */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
            <div>
              <h2 className="text-sm font-bold text-slate-900 mb-0.5">Informasi Dasar</h2>
              <p className="text-xs text-slate-400">Detail utama produk atau layanan Anda</p>
            </div>
            <div>
              <Label htmlFor="product_name" required hintKey="product_name">Nama Produk / Layanan</Label>
              <input id="product_name" name="product_name" type="text" placeholder="cth: SalesGen AI" required disabled={streaming} value={formData.product_name} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <Label htmlFor="description" required hintKey="description">Deskripsi Produk</Label>
              <textarea id="description" name="description" rows={4} placeholder="Jelaskan produk Anda secara detail..." required disabled={streaming} value={formData.description} onChange={handleChange} className={`${inputClass} resize-none`} />
            </div>
            <div>
              <Label htmlFor="target_audience" hintKey="target_audience">Target Audiens</Label>
              <input id="target_audience" name="target_audience" type="text" placeholder="cth: Pengusaha UMKM" disabled={streaming} value={formData.target_audience} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 mb-0.5">Fitur Utama</h2>
                <p className="text-xs text-slate-400">Tambahkan fitur lalu tekan Enter atau klik Tambah</p>
              </div>
              <FieldHint content={hints.features} />
            </div>
            <div className="flex gap-2">
              <input type="text" placeholder="cth: Generate otomatis dengan AI" disabled={streaming} value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} onKeyDown={handleFeatureKeyDown} className={`${inputClass} flex-1`} />
              <Button type="button" variant="outline" onClick={addFeature} disabled={streaming || !featureInput.trim()} className="shrink-0 gap-1.5">
                <Plus className="w-4 h-4" /> Tambah
              </Button>
            </div>
            {formData.features.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full border border-indigo-100">
                    {feature}
                    <button type="button" onClick={() => removeFeature(i)} disabled={streaming} className="hover:text-indigo-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Belum ada fitur yang ditambahkan.</p>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
            <div>
              <h2 className="text-sm font-bold text-slate-900 mb-0.5">Harga & Keunggulan</h2>
              <p className="text-xs text-slate-400">Informasi harga dan nilai jual unik</p>
            </div>
            <div>
              <Label htmlFor="price" hintKey="price">Harga</Label>
              <input id="price" name="price" type="text" placeholder="cth: Rp 299.000 / bulan" disabled={streaming} value={formData.price} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <Label htmlFor="unique_selling_points" hintKey="unique_selling_points">Unique Selling Points</Label>
              <textarea id="unique_selling_points" name="unique_selling_points" rows={3} placeholder="Apa yang membuat produk Anda berbeda?" disabled={streaming} value={formData.unique_selling_points} onChange={handleChange} className={`${inputClass} resize-none`} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 mb-0.5">Gambar</h2>
              <p className="text-xs text-slate-400">Opsional — foto produk & logo (maks 2MB)</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <ImageUploader label="Foto Produk" type="product" value={productImage} onChange={setProductImage} disabled={streaming} />
              <ImageUploader label="Logo" type="logo" value={logoImage} onChange={setLogoImage} disabled={streaming} />
            </div>
          </div>

          <PromptOptions value={options} onChange={setOptions} disabled={streaming} />

          <Button type="button" onClick={handleGenerate} disabled={streaming} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 gap-2">
            {streaming ? (<><Loader2 className="w-4 h-4 animate-spin" /> AI sedang bekerja...</>) : (<><Sparkles className="w-4 h-4" /> Generate Sales Page</>)}
          </Button>
        </div>

        {/* KANAN — Live preview (sticky di layar lebar) */}
        <div className="xl:sticky xl:top-6 xl:self-start">
          <LivePreviewPanel
            htmlContent={previewHtml}
            isStreaming={streaming}
            hasResult={!!resultId}
            onStop={handleStop}
            onOpenDetail={() => navigate(`/sales-page/${resultId}`)}
            onExport={handleExport}
          />
        </div>
      </div>
    </ContentLayout>
  );
};

export default GeneratePage;
