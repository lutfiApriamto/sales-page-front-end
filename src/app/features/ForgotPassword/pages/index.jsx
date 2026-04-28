import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { forgotPasswordRequest } from '../api';
import { AuthSidePanel } from '../../../../components';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await forgotPasswordRequest(email);
            setSubmitted(true);
            toast.success('Link reset password telah dikirim ke email Anda.');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal mengirim email reset. Coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-50">
            <AuthSidePanel
                title="Lupa password? Tenang, kami bantu pulihkan akses Anda."
                description="Masukkan email yang terdaftar dan kami akan mengirimkan link reset dalam hitungan detik."
                steps={[
                    'Masukkan email akun Anda',
                    'Cek inbox atau folder spam',
                    'Klik link dan buat password baru',
                ]}
            />

            {/* RIGHT PANEL */}
            <div className="flex-1 flex items-center justify-center px-6 py-10">
                <div className="w-full max-w-sm">
                    {/* Mobile brand */}
                    <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <Sparkles className="text-white w-4 h-4" />
                        </div>
                        <span className="text-lg font-bold text-slate-900">
                            SalesGen<span className="text-indigo-600">.ai</span>
                        </span>
                    </div>

                    {!submitted ? (
                        <>
                            <div className="mb-7">
                                <p className="text-xs font-bold tracking-widest text-indigo-600 uppercase mb-2">
                                    Pemulihan Akun
                                </p>
                                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1.5">
                                    Lupa password?
                                </h1>
                                <p className="text-slate-500 text-sm">
                                    Masukkan email Anda dan kami akan mengirimkan link reset password.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                        Alamat Email
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="nama@email.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-3.5 py-2.5 border-2 border-slate-200 rounded-xl text-sm text-slate-900 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-indigo-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Mengirim...' : 'Kirim Link Reset Password'}
                                </button>
                            </form>
                        </>
                    ) : (
                        /* SUCCESS STATE */
                        <div className="text-center">
                            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Mail className="text-emerald-600 w-8 h-8" />
                            </div>
                            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-3">
                                Cek email Anda!
                            </h1>
                            <p className="text-slate-500 text-sm leading-relaxed mb-2">
                                Kami telah mengirim link reset password ke
                            </p>
                            <p className="text-indigo-600 font-semibold text-sm mb-6">{email}</p>
                            <p className="text-xs text-slate-400 leading-relaxed mb-8">
                                Tidak menerima email? Cek folder <span className="font-medium">spam</span> atau{' '}
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="text-indigo-600 font-semibold hover:text-indigo-700"
                                >
                                    coba kirim ulang
                                </button>
                                .
                            </p>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Kembali ke halaman login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;