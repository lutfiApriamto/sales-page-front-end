import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Layout, BarChart3, Zap, Download } from 'lucide-react';

const LandingPage = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger animasi setelah komponen mount
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100 overflow-x-hidden">

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-nav      { animation: slideDown 0.5s ease forwards; }
        .anim-badge    { animation: fadeIn  0.5s ease 0.1s both; }
        .anim-h1       { animation: fadeUp  0.6s ease 0.2s both; }
        .anim-sub      { animation: fadeUp  0.6s ease 0.35s both; }
        .anim-cta      { animation: fadeUp  0.6s ease 0.5s both; }
        .anim-card-1   { animation: scaleIn 0.5s ease 0.6s both; }
        .anim-card-2   { animation: scaleIn 0.5s ease 0.75s both; }
        .anim-card-3   { animation: scaleIn 0.5s ease 0.9s both; }
        .anim-stat-1   { animation: fadeUp  0.5s ease 0.7s both; }
        .anim-stat-2   { animation: fadeUp  0.5s ease 0.85s both; }
        .anim-stat-3   { animation: fadeUp  0.5s ease 1.0s both; }
        .anim-feat-1   { animation: fadeUp  0.5s ease 0.3s both; }
        .anim-feat-2   { animation: fadeUp  0.5s ease 0.45s both; }
        .anim-feat-3   { animation: fadeUp  0.5s ease 0.6s both; }
        .anim-feat-4   { animation: fadeUp  0.5s ease 0.75s both; }
        .anim-cta-sec  { animation: scaleIn 0.6s ease 0.3s both; }

        .card-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(99,102,241,0.1); }

        .ping-dot span:first-child {
          animation: ping 1.5s cubic-bezier(0,0,0.2,1) infinite;
        }
      `}</style>

      {/* NAVBAR */}
      <nav className={`fixed top-0 w-full z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md ${mounted ? 'anim-nav' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              SalesGen<span className="text-indigo-600">.ai</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-indigo-600 transition-all shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-36 pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center">

          {/* Badge */}
          <div className={`${mounted ? 'anim-badge' : 'opacity-0'} inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 border border-indigo-100`}>
            <span className="ping-dot relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            V1.0 is now live — Powered by Gemini AI
          </div>

          {/* Headline */}
          <h1 className={`${mounted ? 'anim-h1' : 'opacity-0'} text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]`}>
            Generate High-Converting <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-violet-500">
              Sales Pages in Seconds.
            </span>
          </h1>

          {/* Subheadline */}
          <p className={`${mounted ? 'anim-sub' : 'opacity-0'} text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed`}>
            Hentikan pemborosan waktu untuk copywriting. Biarkan AI kami meracik landing page profesional yang persuasif dan berorientasi konversi untuk produk Anda.
          </p>

          {/* CTA Buttons */}
          <div className={`${mounted ? 'anim-cta' : 'opacity-0'} flex flex-col sm:flex-row items-center justify-center gap-4 mb-20`}>
            <Link
              to="/register"
              className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 group"
            >
              Coba Gratis Sekarang
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              Sudah punya akun? Login →
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[
              { value: '< 30s', label: 'Generate time', cls: 'anim-stat-1' },
              { value: '8+',    label: 'Seksi per halaman', cls: 'anim-stat-2' },
              { value: '100%',  label: 'Export ready', cls: 'anim-stat-3' },
            ].map(({ value, label, cls }) => (
              <div key={label} className={`${mounted ? cls : 'opacity-0'} text-center`}>
                <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</p>
                <p className="text-xs text-slate-400 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />
      </div>

      {/* FEATURES SECTION */}
      <section id="features" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase">Fitur Unggulan</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 mb-4 tracking-tight">
              Efisiensi Tanpa Kompromi
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
              Didesain untuk profesional yang menghargai kecepatan, ketepatan, dan hasil yang bisa langsung digunakan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: BarChart3,
                color: 'indigo',
                title: 'Data-Driven Copy',
                desc: 'AI menganalisis produk Anda dan menghasilkan poin manfaat yang emosional namun rasional.',
                cls: 'anim-feat-1',
              },
              {
                icon: Layout,
                color: 'violet',
                title: 'Clean Structure',
                desc: 'Output HTML rapi dengan struktur Headline, Problem-Solution, dan CTA yang teruji.',
                cls: 'anim-feat-2',
              },
              {
                icon: Zap,
                color: 'amber',
                title: 'Instant Iteration',
                desc: 'Tidak puas? Generate ulang dalam hitungan detik hingga hasilnya sempurna.',
                cls: 'anim-feat-3',
              },
              {
                icon: Download,
                color: 'emerald',
                title: 'Export HTML',
                desc: 'Download halaman sebagai file HTML mandiri siap hosting di mana saja.',
                cls: 'anim-feat-4',
              },
            ].map(({ icon: Icon, color, title, desc, cls }) => (
              <div
                key={title}
                className={`card-hover bg-white p-7 rounded-2xl border border-slate-100 shadow-sm`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 bg-${color}-50`}>
                  <Icon className={`text-${color}-600 w-5 h-5`} />
                </div>
                <h3 className="text-base font-bold mb-2 text-slate-900">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-28 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase">Cara Kerja</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 mb-4 tracking-tight">
              3 Langkah Sederhana
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Dari input produk ke sales page siap pakai — tanpa ribet, tanpa coding.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Isi Form Produk', desc: 'Masukkan nama, deskripsi, fitur, harga, dan USP produk Anda ke dalam form yang terstruktur.' },
              { step: '02', title: 'AI Generate Konten', desc: 'Gemini AI memproses data Anda dan menghasilkan copywriting sales page yang persuasif dalam detik.' },
              { step: '03', title: 'Preview & Export', desc: 'Lihat hasilnya dalam live preview, ganti template, lalu export sebagai file HTML siap hosting.' },
            ].map(({ step, title, desc }, i) => (
              <div key={step} className="relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-6 left-full w-full h-px bg-linear-to-r from-indigo-200 to-transparent -translate-x-4 z-0" />
                )}
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center mb-5">
                    <span className="text-white font-extrabold text-sm">{step}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-28 px-6">
        <div className={`max-w-3xl mx-auto text-center bg-indigo-600 rounded-3xl p-14`}>
          <Sparkles className="text-indigo-300 w-8 h-8 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
            Siap membuat sales page pertama Anda?
          </h2>
          <p className="text-indigo-200 text-sm leading-relaxed mb-8 max-w-md mx-auto">
            Gratis untuk dicoba. Tidak perlu kartu kredit. Langsung generate dalam 30 detik.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-indigo-700 px-8 py-4 rounded-xl font-bold hover:bg-indigo-50 transition-all group"
          >
            Mulai Gratis Sekarang
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="text-white w-4 h-4" />
            </div>
            <span className="text-base font-bold tracking-tight text-slate-900">
              SalesGen<span className="text-indigo-600">.ai</span>
            </span>
          </div>
          <p className="text-slate-400 text-sm">© 2026 SalesGen AI Lab. Built for professionals.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;