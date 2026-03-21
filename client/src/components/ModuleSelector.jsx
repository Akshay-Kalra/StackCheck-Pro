const MODULES = [
  {
    id: "npm",
    label: "npm Packages",
    description: "package.json",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M0 0h24v24H0V0zm6 18V6h12v12h-3V9h-3v9H6z" />
      </svg>
    ),
  },
  {
    id: "pypi",
    label: "Python Packages",
    description: "requirements.txt",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.912S0 5.789 0 11.969c0 6.18 3.403 5.963 3.403 5.963h2.031v-2.868s-.109-3.402 3.35-3.402h5.77s3.24.052 3.24-3.131V3.197S18.28 0 11.914 0zM8.708 1.85a1.045 1.045 0 1 1 0 2.089 1.045 1.045 0 0 1 0-2.089zm4.17 19.302v2.868h-2.031s-3.403.216-3.403-5.963c0-6.18 3.912-6.534 3.912-6.534h7.109s3.535.035 3.535-3.403V5.068h2.031s3.403.217 3.403 5.963c0 6.18-3.403 5.963-3.403 5.963h-5.77s-3.35-.052-3.35 3.402l-.033 1.756zm2.414-19.302a1.045 1.045 0 1 1 0 2.089 1.045 1.045 0 0 1 0-2.089z"/>
      </svg>
    ),
  },
  {
    id: "vscode",
    label: "VS Code Extensions",
    description: ".vscode/extensions.json",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" />
      </svg>
    ),
  },
  {
    id: "system",
    label: "System Scan",
    description: "scanner/scan_output.json",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export default function ModuleSelector({ selected, onChange }) {
  function toggle(id) {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {MODULES.map((mod) => {
        const active = selected.includes(mod.id);
        return (
          <button
            key={mod.id}
            id={`module-${mod.id}`}
            type="button"
            onClick={() => toggle(mod.id)}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-center
              transition-all duration-200 hover:scale-[1.03]
              ${active
                ? "border-brand-500 bg-brand-500/10 text-brand-300"
                : "border-surface-500 bg-surface-800 text-slate-500 hover:border-surface-400 hover:text-slate-400"
              }`}
          >
            <span className={active ? "text-brand-400" : ""}>{mod.icon}</span>
            <span className="text-sm font-semibold leading-tight">{mod.label}</span>
            <span className="text-xs font-mono opacity-60">{mod.description}</span>
            {active && (
              <span className="text-xs text-brand-400 font-medium">Selected ✓</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
