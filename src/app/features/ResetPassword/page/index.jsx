import { useState, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthSidePanel } from '../../../../components';
import { resetPasswordRequest } from '../api';

const passwordRules = [
    { id: 'uppercase', label: 'Huruf kapital (A-Z)',       test: (v) => /[A-Z]/.test(v) },
    { id: 'lowercase', label: 'Huruf kecil (a-z)',         test: (v) => /[a-z]/.test(v) },
    { id: 'number',    label: 'Angka (0-9)',               test: (v) => /[0-9]/.test(v) },
    { id: 'special',   label: 'Karakter spesial (!@#$...)',test: (v) => /[^A-Za-z0-9]/.test(v) },
    { id: 'minlength', label: 'Minimal 8 karakter',        test: (v) => v.length >= 8 },
];

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Ambil token & email dari URL query params
    const token = searchParams.get('token') ?? '';
    const email = searchParams.get('email') ?? '';

    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    const passwordChecks = useMemo(() =>
        passwordRules.map((rule) => ({ ...rule, passed: rule.test(password) })),
        [password]
    );

    const isPasswordValid = passwordChecks.every((r) => r.passed);

    const passwordMatch =
        passwordConfirmation === '' || password === passwordConfirmation;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token || !email) {
            toast.error('Link reset password tidak valid. Silakan request ulang.');
            return;
        }
        if (!isPasswordValid) {
            toast.error('Password belum memenuhi semua persyaratan.');
            return;
        }
        if (password !== passwordConfirmation) {
            toast.error('Password dan konfirmasi password tidak cocok.');
            return;
        }

        setLoading(true);
        try {
            await resetPasswordRequest({
                token,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });
            toast.success('Password berhasil diubah! Silakan login.');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal mereset password. Coba request ulang.');
        } finally {
            setLoading(false);
        }
    };

    // Tampilan jika token/email tidak ada di URL
    if (!token || !email) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
                <div className="text-center max-w-sm">
                    <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl">⚠️</span>
                    </div>
                    <h1 className="text-xl font-extrabold text-slate-900 mb-3">Link Tidak Valid</h1>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">
                        Link reset password yang Anda gunakan tidak valid atau sudah kadaluarsa.
                    </p>
                    <Link
                        to="/forgot-password"
                        className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors"
                    >
                        Request Link Baru
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-slate-50">
            <AuthSidePanel
                title="Buat password baru yang kuat untuk akun Anda."
                description="Pastikan password baru Anda memenuhi semua persyaratan keamanan agar akun tetap terlindungi."
                steps={[
                    'Masukkan password baru Anda',
                    'Pastikan memenuhi semua syarat keamanan',
                    'Konfirmasi dan login kembali',
                ]}
            />

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

                    <div className="mb-7">
                        <p className="text-xs font-bold tracking-widest text-indigo-600 uppercase mb-2">
                            Pemulihan Akun
                        </p>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1.5">
                            Buat password baru
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Reset untuk akun <span className="font-medium text-slate-700">{email}</span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Password */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Password Baru
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => setPasswordFocused(true)}
                                className="w-full px-3.5 py-2.5 border-2 border-slate-200 rounded-xl text-sm text-slate-900 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400"
                            />

                            {/* Password checklist */}
                            {(passwordFocused || password.length > 0) && (
                                <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                                    {passwordChecks.map((rule) => (
                                        <div key={rule.id} className="flex items-center gap-2">
                                            <div className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                                                rule.passed ? 'bg-emerald-500' : 'border-2 border-slate-300 bg-white'
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
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Konfirmasi Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                required
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                className={`w-full px-3.5 py-2.5 border-2 rounded-xl text-sm text-slate-900 bg-white outline-none transition-all placeholder:text-slate-400 focus:ring-2 ${
                                    !passwordMatch
                                        ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                                        : passwordConfirmation.length > 0 && passwordMatch
                                        ? 'border-emerald-400 focus:border-emerald-400 focus:ring-emerald-100'
                                        : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                                }`}
                            />
                            {passwordConfirmation.length > 0 && (
                                <p className={`text-xs mt-1.5 font-medium ${
                                    passwordMatch ? 'text-emerald-600' : 'text-red-500'
                                }`}>
                                    {passwordMatch ? '✓ Password cocok' : '✗ Password tidak cocok'}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !isPasswordValid || !passwordMatch || passwordConfirmation === ''}
                            className="w-full bg-indigo-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Menyimpan...' : 'Simpan Password Baru →'}
                        </button>
                    </form>

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

export default ResetPasswordPage;