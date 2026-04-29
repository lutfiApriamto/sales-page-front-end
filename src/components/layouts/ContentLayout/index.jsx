const ContentLayout = ({ title, description, action, children }) => {
    return (
        <div className="space-y-6 bg-white shadow p-4 rounded-md min-h-screen overflow-x-auto">
            {/* Page Header */}
            {(title || action) && (
                <div className="flex items-start justify-between gap-4">
                    <div>
                        {title && (
                            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                                {title}
                            </h1>
                        )}
                        {description && (
                            <p className="text-sm text-slate-500 mt-1">{description}</p>
                        )}
                    </div>
                    {action && (
                        <div className="shrink-0">{action}</div>
                    )}
                </div>
            )}

            {/* Page Content */}
            <div>{children}</div>
        </div>
    );
};

export default ContentLayout;