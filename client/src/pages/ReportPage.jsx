import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReportDashboard from "../components/ReportDashboard.jsx";
import { getAudit } from "../api/auditApi.js";

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function ReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAudit(id);
        setAudit(data);
      } catch {
        setError("Could not load audit report. The ID may be invalid.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 px-6 py-4 border-b border-surface-700 bg-surface-900/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="btn-ghost"
            id="back-btn"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            New Audit
          </button>

          <div className="flex items-center gap-3 ml-auto">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="font-bold text-sm tracking-tight">StackCheck Pro</span>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-10">
        <div className="max-w-4xl mx-auto">
          {loading && (
            <div className="flex flex-col items-center gap-4 py-24 animate-fade-in">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-3 h-3 rounded-full bg-brand-400 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
              <p className="text-slate-500 text-sm">Loading audit report…</p>
            </div>
          )}

          {error && (
            <div className="px-4 py-3 rounded-xl bg-severity-critical-bg border border-severity-critical-border text-severity-critical text-sm animate-fade-in">
              {error}
            </div>
          )}

          {audit && (
            <div className="space-y-8">
              <div className="animate-slide-up">
                <h1 className="text-2xl font-bold text-white mb-1">Audit Report</h1>
                {audit.createdAt && (
                  <p className="text-sm text-slate-500">
                    Generated {formatDate(audit.createdAt)} · ID:{" "}
                    <span className="font-mono text-slate-600">{id}</span>
                  </p>
                )}
              </div>

              {audit.inputSummary && (
                <div className="glass-card p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                    Inputs analysed
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {audit.inputSummary.hasPackageJson && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-surface-700 text-slate-300 font-mono">
                        package.json
                      </span>
                    )}
                    {audit.inputSummary.hasRequirementsTxt && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-surface-700 text-slate-300 font-mono">
                        requirements.txt
                      </span>
                    )}
                    {audit.inputSummary.hasExtensionsJson && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-surface-700 text-slate-300 font-mono">
                        extensions.json
                      </span>
                    )}
                    {audit.inputSummary.hasSystemScan && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-surface-700 text-slate-300 font-mono">
                        system scan
                      </span>
                    )}
                  </div>
                </div>
              )}

              {audit.report && audit.report.length > 0 ? (
                <ReportDashboard findings={audit.report} />
              ) : (
                <div className="glass-card p-10 text-center animate-fade-in">
                  <div className="text-4xl mb-3">✅</div>
                  <h2 className="text-lg font-semibold text-white mb-1">All clear!</h2>
                  <p className="text-slate-400 text-sm">No issues found in the analysed inputs.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
