import { useNavigate } from 'react-router-dom';
import { Menu, LogOut, User, ChevronDown } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuthStore } from '@/app/features/Login'; 
import { axiosService } from '@/utils/axiosConst';
import toast from 'react-hot-toast';

const Topbar = ({ toggleMobile, breadcrumbs = [] }) => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axiosService.post('/logout');
        } catch (_) {
            // tetap logout meski request gagal
        } finally {
            logout();
            toast.success('Berhasil logout.');
            navigate('/login');
        }
    };

    // Ambil inisial nama untuk avatar
    const initials = user?.name
        ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    return (
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 lg:px-6 shrink-0">
            {/* LEFT — Mobile menu toggle + Breadcrumb */}
            <div className="flex items-center gap-3">
                {/* Mobile hamburger */}
                <button
                    onClick={toggleMobile}
                    className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
                >
                    <Menu className="w-5 h-5" />
                </button>

                {/* Breadcrumb */}
                {breadcrumbs.length > 0 && (
                    <nav className="hidden sm:flex items-center gap-1.5 text-sm">
                        {breadcrumbs.map((crumb, i) => (
                            <span key={i} className="flex items-center gap-1.5">
                                {i > 0 && <span className="text-slate-300">/</span>}
                                {i === breadcrumbs.length - 1 ? (
                                    <span className="font-semibold text-slate-900">{crumb.label}</span>
                                ) : (
                                    <span
                                        onClick={() => crumb.to && navigate(crumb.to)}
                                        className={`text-slate-400 ${crumb.to ? 'hover:text-slate-600 cursor-pointer' : ''}`}
                                    >
                                        {crumb.label}
                                    </span>
                                )}
                            </span>
                        ))}
                    </nav>
                )}
            </div>

            {/* RIGHT — User dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-slate-50 transition-colors outline-none">
                        <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-bold">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="hidden sm:block text-left">
                            <p className="text-sm font-semibold text-slate-900 leading-tight">{user?.name ?? 'User'}</p>
                            <p className="text-xs text-slate-400 leading-tight truncate max-w-35">{user?.email ?? ''}</p>
                        </div>
                        <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuLabel className="font-normal">
                        <p className="font-semibold text-slate-900 text-sm">{user?.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-slate-600 cursor-pointer">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={handleLogout}
                        className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
};

export default Topbar;