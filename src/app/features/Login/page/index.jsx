import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { loginRequest } from '../api';
import { useAuthStore } from '../store';
import toast from 'react-hot-toast';
import { AuthSidePanel } from '../../../../components'; 

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const setAuth = useAuthStore((state) => state.setAuth);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await loginRequest({ email, password });
            setAuth(res.user, res.token);
            toast.success('Login berhasil! Mengalihkan...');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login gagal. Periksa kembali kredensial Anda.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex bg-slate-50">
            <AuthSidePanel
                title="Ubah produk Anda menjadi sales page dalam hitungan detik."
                description="Platform AI pertama yang dirancang khusus untuk menghasilkan landing page persuasif dan berorientasi konversi."
                steps={[
                    'Generate sales page profesional dengan Gemini AI',
                    'Simpan & kelola semua riwayat sales page Anda',
                    'Export sebagai file HTML siap pakai',
                ]}
            />

            {/* RIGHT PANEL */}
            <div className="flex-1 flex items-center justify-center px-6 py-10">
                <div className="w-full max-w-sm">
                    {/* Mobile brand */}
                    <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <Link to={'/'} >
                                <Sparkles className="text-white w-5 h-5" />
                            </Link>
                        </div>
                        <span className="text-lg font-bold text-slate-900">
                            SalesGen<span className="text-indigo-600">.ai</span>
                        </span>
                    </div>

                    <div className="mb-8">
                        <p className="text-xs font-bold tracking-widest text-indigo-600 uppercase mb-2">Dashboard Access</p>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1.5">Selamat datang kembali</h1>
                        <p className="text-slate-500 text-sm">Masuk untuk melanjutkan ke workspace Anda</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Alamat Email</label>
                            <input
                                type="email" placeholder="nama@email.com" required
                                className="w-full px-3.5 py-2.5 border-2 border-slate-200 rounded-xl text-sm text-slate-900 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
                            <input
                                type="password" placeholder="Masukkan password Anda" required
                                className="w-full px-3.5 py-2.5 border-2 border-slate-200 rounded-xl text-sm text-slate-900 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div className="text-right mt-1.5">
                                <Link to="/forgot-password" className="text-xs text-indigo-600 font-medium hover:text-indigo-700">
                                    Lupa password?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit" disabled={loading}
                            className="w-full bg-indigo-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors mt-2 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Authenticating...' : 'Sign In ke Dashboard'}
                        </button>
                    </form>

                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-slate-200" />
                        <span className="text-xs text-slate-400">Belum punya akun?</span>
                        <div className="flex-1 h-px bg-slate-200" />
                    </div>

                    <div className="text-center text-sm text-slate-500">
                        <Link to="/register" className="text-indigo-600 font-semibold hover:text-indigo-700">
                            Daftar gratis sekarang →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;