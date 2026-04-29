import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, LogOut, User, ChevronDown, Mail, Calendar, Shield, Zap, Loader2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/app/features/Login';
import { axiosService } from '@/utils/axiosConst';
import toast from 'react-hot-toast';

const Topbar = ({ toggleMobile, breadcrumbs = [] }) => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    
    // States untuk Dialog & Data
    const [profileOpen, setProfileOpen] = useState(false);
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const [profileData, setProfileData] = useState(null);

    // Fungsi Fetch Profile
    useEffect(() => {
        const fetchProfileData = async () => {
            if (profileOpen) {
                setIsLoadingProfile(true);
                try {
                    // Hit ke endpoint /profile yang udah lu buat di Laravel
                    const res = await axiosService.get('/profile');
                    if (res.data?.status === 'success') {
                        setProfileData(res.data.data);
                    }
                } catch (error) {
                    toast.error('Gagal mengambil data profil terbaru.');
                } finally {
                    setIsLoadingProfile(false);
                }
            } else {
                // Reset data saat modal ditutup agar efek loading tetap muncul saat dibuka lagi
                setTimeout(() => setProfileData(null), 200); 
            }
        };

        fetchProfileData();
    }, [profileOpen]);

    const handleLogout = async () => {
        try {
            await axiosService.post('/logout');
        } catch (_) {}
        finally {
            logout();
            toast.success('Berhasil logout.');
            navigate('/login');
        }
    };

    // Gunakan profileData jika ada, jika tidak fallback ke user context (Zustand)
    const displayUser = profileData || user;

    const initials = displayUser?.name
        ? displayUser.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    const joinDate = displayUser?.created_at
        ? new Date(displayUser.created_at).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
          })
        : null;

    return (
        <>
            {/* Profile Dialog */}
            <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-base font-bold text-slate-900">
                            Profil Pengguna
                        </DialogTitle>
                    </DialogHeader>

                    {isLoadingProfile && !profileData ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
                            <p className="text-sm font-medium text-slate-500">Mengambil data...</p>
                        </div>
                    ) : (
                        <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
                            {/* Avatar & Name */}
                            <div className="flex flex-col items-center text-center pt-2">
                                <Avatar className="w-16 h-16 mb-3 ring-4 ring-slate-50">
                                    <AvatarFallback className="bg-indigo-600 text-white text-xl font-bold">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                                    {displayUser?.name ?? '-'}
                                </h3>
                                <Badge
                                    variant="secondary"
                                    className="mt-1.5 bg-slate-100 text-slate-600 border-slate-200 text-xs font-semibold"
                                >
                                    <Shield className="w-3 h-3 mr-1" />
                                    Member Aktif
                                </Badge>
                            </div>

                            <div className="bg-linier-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-md shadow-indigo-200">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-0.5">Sisa AI Credits</p>
                                        <p className="text-3xl font-black text-slate-900 leading-none">
                                            {displayUser?.credits ?? 0}
                                        </p>
                                    </div>
                                </div>
                                <Badge className="bg-white text-indigo-700 hover:bg-white border-indigo-200 shadow-sm pointer-events-none">
                                    Kuota API
                                </Badge>
                            </div>

                            {/* Info List */}
                            <div className="space-y-3 px-1">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                        <Mail className="w-4 h-4 text-slate-500" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-0.5">Alamat Email</p>
                                        <p className="text-sm font-semibold text-slate-900 truncate">
                                            {displayUser?.email ?? '-'}
                                        </p>
                                    </div>
                                </div>

                                {joinDate && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                            <Calendar className="w-4 h-4 text-slate-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-0.5">Bergabung Sejak</p>
                                            <p className="text-sm font-semibold text-slate-900">
                                                {joinDate}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-slate-100" />

                            {/* Actions */}
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="flex-1 text-sm font-bold text-slate-600"
                                    onClick={() => setProfileOpen(false)}
                                >
                                    Tutup
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1 text-sm font-bold text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                    onClick={() => {
                                        setProfileOpen(false);
                                        handleLogout();
                                    }}
                                >
                                    <LogOut className="w-4 h-4 mr-1.5" />
                                    Logout
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Topbar Main Header */}
            <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 lg:px-6 shrink-0 z-10">
                {/* LEFT */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleMobile}
                        className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {breadcrumbs.length > 0 && (
                        <nav className="hidden sm:flex items-center gap-1.5 text-sm">
                            {breadcrumbs.map((crumb, i) => {
                                const isLast = i === breadcrumbs.length - 1;
                                return (
                                    <span key={i} className="flex items-center gap-1.5">
                                        {i > 0 && <span className="text-slate-300">/</span>}
                                        {isLast ? (
                                            <span className="font-semibold text-indigo-600">
                                                {crumb.label}
                                            </span>
                                        ) : (
                                            <span
                                                onClick={() => crumb.to && navigate(crumb.to)}
                                                className={`text-slate-400 transition-colors ${
                                                    crumb.to ? 'hover:text-slate-600 cursor-pointer' : ''
                                                }`}
                                            >
                                                {crumb.label}
                                            </span>
                                        )}
                                    </span>
                                );
                            })}
                        </nav>
                    )}
                </div>

                {/* RIGHT */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-slate-50 transition-colors outline-none">
                            <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-bold">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden sm:block text-left">
                                <p className="text-sm font-semibold text-slate-900 leading-tight">
                                    {user?.name ?? 'User'}
                                </p>
                                <p className="text-xs text-slate-400 leading-tight truncate max-w-35">
                                    {user?.email ?? ''}
                                </p>
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
                        <DropdownMenuItem
                            className="text-slate-600 cursor-pointer font-medium"
                            onClick={() => setProfileOpen(true)}
                        >
                            <User className="w-4 h-4 mr-2" />
                            Profile & Kuota
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50 font-medium"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </header>
        </>
    );
};

export default Topbar;