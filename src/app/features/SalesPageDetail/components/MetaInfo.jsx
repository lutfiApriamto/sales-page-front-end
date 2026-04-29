const MetaInfo = ({ salesPage }) => {
    const items = [
        { label: 'Produk', value: salesPage?.product_name },
        { label: 'Target Audiens', value: salesPage?.target_audience || '-' },
        { label: 'Harga', value: salesPage?.price || '-' },
        {
            label: 'Dibuat',
            value: new Date(salesPage?.created_at).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'short', year: 'numeric',
            }),
        },
    ];

    return (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {items.map(({ label, value }) => (
                <div key={label} className="bg-white rounded-xl border border-slate-100 px-4 py-3">
                    <p className="text-xs text-slate-400 mb-0.5">{label}</p>
                    <p className="text-sm font-semibold text-slate-900 truncate">{value}</p>
                </div>
            ))}
        </div>
    );
};

export default MetaInfo;