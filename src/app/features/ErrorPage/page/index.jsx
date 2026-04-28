import { Link, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { Sparkles, AlertTriangle, ServerCrash, FileQuestion } from 'lucide-react';

const errorConfig = {
    404: {
        icon: FileQuestion,
        code: '404',
        title: 'Halaman tidak ditemukan',
        description: 'Halaman yang Anda cari tidak ada atau mungkin sudah dipindahkan.',
        color: 'indigo',
    },
    500: {
        icon: ServerCrash,
        code: '500',
        title: 'Terjadi kesalahan server',
        description: 'Server kami sedang mengalami gangguan. Silakan coba beberapa saat lagi.',
        color: 'red',
    },
    default: {
        icon: AlertTriangle,
        code: 'Oops',
        title: 'Terjadi kesalahan',
        description: 'Sesuatu yang tidak terduga terjadi. Silakan coba kembali.',
        color: 'amber',
    },
};

const colorMap = {
    indigo: {
        bg: 'bg-indigo-50',
        icon: 'text-indigo-500',
        code: 'text-indigo-100',
        badge: 'bg-indigo-100 text-indigo-700',
        btn: 'bg-indigo-600 hover:bg-indigo-700',
    },
    red: {
        bg: 'bg-red-50',
        icon: 'text-red-500',
        code: 'text-red-100',
        badge: 'bg-red-100 text-red-700',
        btn: 'bg-red-600 hover:bg-red-700',
    },
    amber: {
        bg: 'bg-amber-50',
        icon: 'text-amber-500',
        code: 'text-amber-100',
        badge: 'bg-amber-100 text-amber-700',
        btn: 'bg-amber-500 hover:bg-amber-600',
    },
};

const ErrorPage = ({ code: codeProp, title: titleProp, description: descProp }) => {
    const routeError = useRouteError?.();

    // Tentukan status code — dari route error, prop, atau default
    let statusCode = codeProp ?? null;
    if (!statusCode && isRouteErrorResponse?.(routeError)) {
        statusCode = routeError.status;
    }

    const config = errorConfig[statusCode] ?? errorConfig.default;
    const colors = colorMap[config.color];
    const Icon = config.icon;

    const title = titleProp ?? config.title;
    const description = descProp ?? config.description;
    const code = statusCode ?? config.code;

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center px-6 ${colors.bg}`}>
            {/* Brand */}
            <Link to="/" className="flex items-center gap-2 mb-16">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="text-white w-4 h-4" />
                </div>
                <span className="text-lg font-bold text-slate-900 tracking-tight">
                    SalesGen<span className="text-indigo-600">.ai</span>
                </span>
            </Link>

            <div className="w-full max-w-md text-center">
                {/* Error code besar di background */}
                <div className="relative mb-8">
                    <p className={`text-[120px] font-extrabold leading-none select-none ${colors.code}`}>
                        {code}
                    </p>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                            <Icon className={`w-10 h-10 ${colors.icon}`} />
                        </div>
                    </div>
                </div>

                {/* Badge */}
                <span className={`inline-block text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-4 ${colors.badge}`}>
                    Error {code}
                </span>

                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-3">
                    {title}
                </h1>
                <p className="text-slate-500 text-sm leading-relaxed mb-10">
                    {description}
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        to="/"
                        className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-colors ${colors.btn}`}
                    >
                        Kembali ke Beranda
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-white border-2 border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                        Halaman Sebelumnya
                    </button>
                </div>
            </div>

            <p className="mt-16 text-xs text-slate-400">
                © 2026 SalesGen AI Lab. Built for professionals.
            </p>
        </div>
    );
};

export default ErrorPage;