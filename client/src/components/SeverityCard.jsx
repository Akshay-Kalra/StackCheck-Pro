import { useState } from "react";

const SEVERITY_META = {
  CRITICAL: {
    label: "Critical",
    dot: "bg-severity-critical",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
  },
  WARNING: {
    label: "Warning",
    dot: "bg-severity-warning",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
  },
  INFO: {
    label: "Info",
    dot: "bg-severity-info",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
  },
};

export default function SeverityCard({ finding }) {
  const [copied, setCopied] = useState(false);
  const meta = SEVERITY_META[finding.severity] || SEVERITY_META.INFO;

  async function copyCommand() {
    if (!finding.fixCommand) return;
    await navigator.clipboard.writeText(finding.fixCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={`finding-card ${finding.severity} animate-fade-in`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 min-w-0">
          <span className={`severity-badge ${finding.severity} shrink-0 mt-0.5`}>
            {meta.icon}
            {meta.label}
          </span>
          {finding.category && (
            <span className="text-xs px-2 py-1 rounded-md bg-surface-600 text-slate-400 font-mono shrink-0 mt-0.5">
              {finding.category}
            </span>
          )}
        </div>
      </div>

      <h3 className="text-sm font-semibold text-slate-100 mb-1.5 leading-snug">
        {finding.title}
      </h3>
      <p className="text-sm text-slate-400 leading-relaxed mb-4">
        {finding.description}
      </p>

      {finding.fixCommand && (
        <div className="relative bg-surface-900 rounded-lg overflow-hidden border border-surface-600">
          <div className="flex items-center justify-between px-3 py-1.5 bg-surface-800 border-b border-surface-600">
            <span className="text-xs text-slate-500 font-mono">Fix command</span>
            <button
              type="button"
              onClick={copyCommand}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors duration-150"
              title="Copy to clipboard"
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
          <pre className="px-4 py-3 text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap break-all">
            {finding.fixCommand}
          </pre>
        </div>
      )}
    </div>
  );
}
