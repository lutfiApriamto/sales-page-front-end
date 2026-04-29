import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Sparkles, PlusCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

const navItems = [
    {
        label: 'Dashboard',
        icon: LayoutDashboard,
        to: '/dashboard',
    },
    {
        label: 'Buat Sales Page',
        icon: PlusCircle,
        to: '/generate',
    },
];

const Sidebar = ({ collapsed, mobileOpen, toggleCollapsed, closeMobile }) => {
    const location = useLocation();

    const NavLink = ({ item }) => {
        const isActive = location.pathname === item.to;
        const Icon = item.icon;

        const linkClass = `
            flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
            transition-all duration-150 group relative
            ${isActive
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }
            ${collapsed ? 'justify-center' : ''}
        `;

        if (collapsed) {
            return (
                <TooltipProvider delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link to={item.to} className={linkClass} onClick={closeMobile}>
                                <Icon className="w-5 h-5" />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>{item.label}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        }

        return (
            <Link to={item.to} className={linkClass} onClick={closeMobile}>
                <Icon className="w-5 h-5" />
                <span className="truncate">{item.label}</span>
            </Link>
        );
    };

    const sidebarContent = (
        <div className="flex flex-col h-full">
        {/* Brand */}
        <div className={`flex items-center h-16 px-4 border-b border-slate-100 ${collapsed ? 'justify-center' : 'justify-between'}`}>
            
            {/* Logo */}
            {!collapsed && (
                <Link to="/dashboard" className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                        <Sparkles className="text-white w-4 h-4" />
                    </div>
                    <span className="text-base font-bold tracking-tight text-slate-900">
                        SalesGen<span className="text-indigo-600">.ai</span>
                    </span>
                </Link>
            )}

            {collapsed && (
                <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                    <Sparkles className="text-white w-4 h-4" />
                </div>
            )}

            {/* Desktop collapse toggle — sebelah logo */}
            <button
                onClick={toggleCollapsed}
                className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all shrink-0"
            >
                {collapsed
                    ? <ChevronRight className="w-4 h-4" />
                    : <ChevronLeft className="w-4 h-4" />
                }
            </button>

            {/* Mobile close button */}
            <button
                onClick={closeMobile}
                className="lg:hidden p-1 rounded-lg hover:bg-slate-100 text-slate-500"
            >
                <X className="w-4 h-4" />
            </button>
        </div>

            {/* Nav Items */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink key={item.to} item={item} />
                ))}
            </nav>

        </div>
    );

    return (
        <>
            {/* DESKTOP SIDEBAR */}
            <aside
                className={`
                    hidden lg:flex flex-col bg-white border-r border-slate-100
                    transition-all duration-300 ease-in-out
                    ${collapsed ? 'w-18' : 'w-64'}
                `}
            >
                {sidebarContent}
            </aside>

            {/* MOBILE OVERLAY */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                    onClick={closeMobile}
                />
            )}

            {/* MOBILE SIDEBAR */}
            <aside
                className={`
                    fixed top-0 left-0 h-full z-50 w-64 bg-white border-r border-slate-100
                    transform transition-transform duration-300 ease-in-out lg:hidden
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {sidebarContent}
            </aside>
        </>
    );
};

export default Sidebar;