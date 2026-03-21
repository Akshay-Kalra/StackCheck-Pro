import SeverityCard from "./SeverityCard.jsx";

const ORDER = ["CRITICAL", "WARNING", "INFO"];

const SECTION_META = {
  CRITICAL: {
    title: "Critical Issues",
    subtitle: "Must fix immediately — security or stability risk",
    gradient: "from-severity-critical/20 to-transparent",
    border: "border-severity-critical-border",
    count: "bg-severity-critical-bg text-severity-critical border border-severity-critical-border",
  },
  WARNING: {
    title: "Warnings",
    subtitle: "Should fix soon — may cause issues",
    gradient: "from-severity-warning/20 to-transparent",
    border: "border-severity-warning-border",
    count: "bg-severity-warning-bg text-severity-warning border border-severity-warning-border",
  },
  INFO: {
    title: "Info & Suggestions",
    subtitle: "Best practice improvements and optional upgrades",
    gradient: "from-severity-info/20 to-transparent",
    border: "border-severity-info-border",
    count: "bg-severity-info-bg text-severity-info border border-severity-info-border",
  },
};

export default function ReportDashboard({ findings }) {
  const grouped = findings.reduce((acc, f) => {
    const key = f.severity || "INFO";
    if (!acc[key]) acc[key] = [];
    acc[key].push(f);
    return acc;
  }, {});

  const total = findings.length;
  const critCount = (grouped.CRITICAL || []).length;
  const warnCount = (grouped.WARNING || []).length;
  const infoCount = (grouped.INFO || []).length;

  return (
    <div className="flex flex-col gap-8 animate-slide-up">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Critical", count: critCount, cls: SECTION_META.CRITICAL.count },
          { label: "Warnings", count: warnCount, cls: SECTION_META.WARNING.count },
          { label: "Info", count: infoCount, cls: SECTION_META.INFO.count },
        ].map(({ label, count, cls }) => (
          <div key={label} className="glass-card p-4 text-center">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold mb-2 ${cls}`}>
              {count}
            </div>
            <p className="text-xs text-slate-500 font-medium">{label}</p>
          </div>
        ))}
      </div>

      <p className="text-sm text-slate-500 text-center">
        {total} finding{total !== 1 ? "s" : ""} across your environment
      </p>

      {ORDER.map((severity) => {
        const items = grouped[severity];
        if (!items || items.length === 0) return null;
        const meta = SECTION_META[severity];
        return (
          <section key={severity}>
            <div className={`flex items-center gap-3 mb-4 pb-3 border-b ${meta.border}`}>
              <h2 className="text-base font-bold text-slate-200">{meta.title}</h2>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${meta.count}`}>
                {items.length}
              </span>
              <span className="text-xs text-slate-600 ml-auto hidden sm:block">{meta.subtitle}</span>
            </div>
            <div className="flex flex-col gap-3">
              {items.map((f, i) => (
                <SeverityCard key={i} finding={f} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
