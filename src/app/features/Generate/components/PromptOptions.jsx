const TONES = [
  { value: 'professional', label: 'Profesional' },
  { value: 'casual', label: 'Santai' },
  { value: 'aggressive', label: 'Agresif' },
];

const COLORS = [
  { value: 'blue', label: 'Biru' },
  { value: 'dark', label: 'Gelap' },
  { value: 'green', label: 'Hijau' },
  { value: 'custom', label: 'Custom' },
];

const SECTIONS = [
  { key: 'faq', label: 'FAQ' },
  { key: 'guarantee', label: 'Garansi' },
  { key: 'comparison', label: 'Perbandingan' },
  { key: 'countdown', label: 'Countdown' },
];

const pill = (active) =>
  `px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
    active
      ? 'bg-indigo-600 text-white border-indigo-600'
      : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
  }`;

const PromptOptions = ({ value, onChange, disabled }) => {
  const set = (patch) => onChange({ ...value, ...patch });
  const toggleSection = (key) =>
    onChange({ ...value, sections: { ...value.sections, [key]: !value.sections[key] } });

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
      <div>
        <h2 className="text-sm font-bold text-slate-900 mb-0.5">Opsi AI</h2>
        <p className="text-xs text-slate-400">Atur gaya & struktur sales page</p>
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-700 mb-2">Tone</p>
        <div className="flex flex-wrap gap-2">
          {TONES.map((t) => (
            <button key={t.value} type="button" disabled={disabled}
              onClick={() => set({ tone: t.value })} className={pill(value.tone === t.value)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-700 mb-2">Skema Warna</p>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button key={c.value} type="button" disabled={disabled}
              onClick={() => set({ color_scheme: c.value })} className={pill(value.color_scheme === c.value)}>
              {c.label}
            </button>
          ))}
        </div>
        {value.color_scheme === 'custom' && (
          <div className="flex items-center gap-2 mt-3">
            <input type="color" disabled={disabled} value={value.custom_color || '#4f46e5'}
              onChange={(e) => set({ custom_color: e.target.value })}
              className="h-9 w-12 rounded border border-slate-200 bg-white" />
            <span className="text-xs text-slate-500">{value.custom_color || '#4f46e5'}</span>
          </div>
        )}
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-700 mb-2">Section Tambahan</p>
        <div className="flex flex-wrap gap-2">
          {SECTIONS.map((s) => (
            <button key={s.key} type="button" disabled={disabled}
              onClick={() => toggleSection(s.key)} className={pill(value.sections[s.key])}>
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromptOptions;
