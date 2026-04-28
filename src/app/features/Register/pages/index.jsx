import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { registerRequest } from '../api';
import { useAuthStore } from '../../Login';
import { AuthSidePanel } from '../../../../components'; 


const passwordRules = [
    { id: 'uppercase', label: 'Huruf kapital (A-Z)', test: (v) => /[A-Z]/.test(v) },
    { id: 'lowercase', label: 'Huruf kecil (a-z)',  test: (v) => /[a-z]/.test(v) },
    { id: 'number',    label: 'Angka (0-9)',         test: (v) => /[0-9]/.test(v) },
    { id: 'special',   label: 'Karakter spesial (!@#$...)', test: (v) => /[^A-Za-z0-9]/.test(v) },
    { id: 'minlength', label: 'Minimal 8 karakter',  test: (v) => v.length >= 8 },
];

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [loading, setLoading] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    const setAuth = useAuthStore((state) => state.setAuth);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Cek tiap rule password secara realtime
    const passwordChecks = useMemo(() => {
        return passwordRules.map((rule) => ({
            ...rule,
            passed: rule.test(formData.password),
        }));
    }, [formData.password]);

    const isPasswordValid = passwordChecks.every((r) => r.passed);

    const passwordMatch =
        formData.password_confirmation === '' ||
        formData.password === formData.password_confirmation;

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!isPasswordValid) {
            toast.error('Password belum memenuhi semua persyaratan.');
            return;
        }

        if (formData.password !== formData.password_confirmation) {
            toast.error('Password dan konfirmasi password tidak cocok.');
            return;
        }

        setLoading(true);
        try {
            const res = await registerRequest(formData);
            setAuth(res.user, res.access_token);
            toast.success('Akun berhasil dibuat! Selamat datang 🎉');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registrasi gagal. Cek kembali data Anda.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-50">
            <AuthSidePanel
                title="Mulai gratis. Hasilkan sales page pertama Anda hari ini."
                description="Bergabung dengan ribuan profesional yang sudah menggunakan SalesGen AI untuk mengakselerasi konversi produk mereka."
                steps={[
                    'Buat akun gratis dalam 30 detik',
                    'Isi form spesifikasi produk Anda',
                    'AI generate sales page siap pakai',
                ]}
            />

            {/* RIGHT PANEL */}
            <div className="flex-1 flex items-center justify-center px-6 py-10">
                <div className="w-full max-w-md">
                    {/* Mobile brand */}
                    <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <Sparkles className="text-white w-4 h-4" />
                        </div>
                        <span className="text-lg font-bold text-slate-900">
                            SalesGen<span className="text-indigo-600">.ai</span>
                        </span>
                    </div>

                    <div className="mb-7">
                        <p className="text-xs font-bold tracking-widest text-indigo-600 uppercase mb-2">Daftar Gratis</p>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1.5">Buat akun Anda</h1>
                        <p className="text-slate-500 text-sm">Tidak perlu kartu kredit. Langsung bisa digunakan.</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4">
                        {/* Nama */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nama Lengkap</label>
                            <input
                                name="name" type="text" placeholder="John Doe" required
                                className="w-full px-3.5 py-2.5 border-2 border-slate-200 rounded-xl text-sm text-slate-900 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400"
                                onChange={handleChange}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Alamat Email</label>
                            <input
                                name="email" type="email" placeholder="nama@email.com" required
                                className="w-full px-3.5 py-2.5 border-2 border-slate-200 rounded-xl text-sm text-slate-900 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400"
                                onChange={handleChange}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
                            <input
                                name="password" type="password" placeholder="••••••••" required
                                className="w-full px-3.5 py-2.5 border-2 border-slate-200 rounded-xl text-sm text-slate-900 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400"
                                onChange={handleChange}
                                onFocus={() => setPasswordFocused(true)}
                            />

                            {/* Password rules checklist — muncul saat input password difocus atau ada isian */}
                            {(passwordFocused || formData.password.length > 0) && (
                                <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                                    {passwordChecks.map((rule) => (
                                        <div key={rule.id} className="flex items-center gap-2">
                                            {/* Checkbox visual */}
                                            <div className={`w-4 h-4 rounded flex items-center justify-center  transition-colors ${
                                                rule.passed
                                                    ? 'bg-emerald-500'
                                                    : 'border-2 border-slate-300 bg-white'
                                            }`}>
                                                {rule.passed && (
                                                    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
                                                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                )}
                                            </div>
                                            <span className={`text-xs transition-colors ${
                                                rule.passed ? 'text-emerald-600 font-medium' : 'text-slate-400'
                                            }`}>
                                                {rule.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Konfirmasi Password */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Konfirmasi Password</label>
                            <input
                                name="password_confirmation" type="password" placeholder="••••••••" required
                                className={`w-full px-3.5 py-2.5 border-2 rounded-xl text-sm text-slate-900 bg-white outline-none transition-all placeholder:text-slate-400 focus:ring-2 ${
                                    !passwordMatch
                                        ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                                        : formData.password_confirmation.length > 0 && passwordMatch
                                        ? 'border-emerald-400 focus:border-emerald-400 focus:ring-emerald-100'
                                        : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                                }`}
                                onChange={handleChange}
                            />
                            {/* Pesan konfirmasi password */}
                            {formData.password_confirmation.length > 0 && (
                                <p className={`text-xs mt-1.5 font-medium ${
                                    passwordMatch ? 'text-emerald-600' : 'text-red-500'
                                }`}>
                                    {passwordMatch
                                        ? '✓ Password cocok'
                                        : '✗ Password tidak cocok'}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !isPasswordValid || !passwordMatch || formData.password_confirmation === ''}
                            className="w-full bg-indigo-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Membuat Akun...' : 'Buat Akun Sekarang →'}
                        </button>
                    </form>

                    <p className="text-xs text-slate-400 text-center mt-4 leading-relaxed">
                        Dengan mendaftar, Anda menyetujui{' '}
                        <span className="text-indigo-600 cursor-pointer">Syarat & Ketentuan</span> dan{' '}
                        <span className="text-indigo-600 cursor-pointer">Kebijakan Privasi</span> kami.
                    </p>

                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-slate-200" />
                        <span className="text-xs text-slate-400">Sudah punya akun?</span>
                        <div className="flex-1 h-px bg-slate-200" />
                    </div>

                    <div className="text-center text-sm">
                        <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">
                            Sign in →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;