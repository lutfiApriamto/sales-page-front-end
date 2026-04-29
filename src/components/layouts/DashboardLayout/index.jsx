import { Outlet, useLocation } from 'react-router-dom';
import { useSidebar } from './useSidebar';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const breadcrumbMap = {
    '/dashboard': [{ label: 'Dashboard' }],
    '/generate':  [{ label: 'Dashboard', to: '/dashboard' }, { label: 'Buat Sales Page' }],
};

const DashboardLayout = () => {
    const { collapsed, mobileOpen, toggleCollapsed, toggleMobile, closeMobile } = useSidebar();
    const location = useLocation();

    const breadcrumbs = breadcrumbMap[location.pathname] ?? [{ label: 'Dashboard', to: '/dashboard' }];

    if (location.pathname.startsWith('/sales-page/')) {
        breadcrumbs.push(
            { label: 'Dashboard', to: '/dashboard' },
            { label: 'Detail Sales Page' }
        );
    }

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <Sidebar
                collapsed={collapsed}
                mobileOpen={mobileOpen}
                toggleCollapsed={toggleCollapsed}
                closeMobile={closeMobile}
            />

            {/* MAIN AREA */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <Topbar
                    toggleMobile={toggleMobile}
                    breadcrumbs={breadcrumbs}
                />

                {/* CONTENT AREA */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;