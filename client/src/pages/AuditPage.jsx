import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModuleSelector from "../components/ModuleSelector.jsx";
import FileUpload from "../components/FileUpload.jsx";
import { submitAudit } from "../api/auditApi.js";

const MODULE_FILE_CONFIG = {
  npm: {
    fieldName: "packageJson",
    label: "package.json",
    description: "Your project's npm dependency manifest",
    accept: ".json,application/json",
  },
  pypi: {
    fieldName: "requirementsTxt",
    label: "requirements.txt",
    description: "Your Python project's dependency list",
    accept: ".txt,text/plain",
  },
  vscode: {
    fieldName: "extensionsJson",
    label: "extensions.json",
    description: "From .vscode/extensions.json in your project",
    accept: ".json,application/json",
  },
  system: {
    fieldName: "systemScan",
    label: "scan_output.json",
    description: "Output from scanner/scan.py — run it first to generate this file",
    accept: ".json,application/json",
  },
};

const LOADING_STEPS = [
  "Parsing uploaded files…",
  "Fetching latest versions from registries…",
  "Sending data to Claude AI…",
  "Building your health report…",
];

export default function AuditPage() {
  const navigate = useNavigate();
  const [selectedModules, setSelectedModules] = useState(["npm"]);
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState(null);

  function handleFile(fieldName, file) {
    setFiles((prev) => ({ ...prev, [fieldName]: file }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (selectedModules.length === 0) {
      setError("Select at least one module to audit.");
      return;
    }

    const hasFile = selectedModules.some(
      (mod) => files[MODULE_FILE_CONFIG[mod].fieldName]
    );
    if (!hasFile) {
      setError("Upload at least one file for the selected modules.");
      return;
    }

    setLoading(true);
    const stepInterval = setInterval(() => {
      setLoadingStep((s) => (s < LOADING_STEPS.length - 1 ? s + 1 : s));
    }, 2500);

    try {
      const formData = new FormData();
      selectedModules.forEach((mod) => {
        const { fieldName } = MODULE_FILE_CONFIG[mod];
        if (files[fieldName]) formData.append(fieldName, files[fieldName]);
      });
      const { id } = await submitAudit(formData);
      navigate(`/report/${id}`);
    } catch (err) {
      setError(err.response?.data?.error || "Audit failed. Check that the server is running.");
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
      setLoadingStep(0);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-4 border-b border-surface-700">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight">StackCheck Pro</span>
          <span className="text-xs text-brand-400 font-medium px-2 py-0.5 bg-brand-500/10 rounded-full border border-brand-500/20 ml-1">
            AI-powered
          </span>
        </div>
      </header>

      <main className="flex-1 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-slide-up">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-slate-200 to-brand-300 bg-clip-text text-transparent leading-tight">
              Developer Environment
              <br />
              Health Check
            </h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Upload your dependency files and get an AI-powered health report with severity-ranked findings and exact fix commands.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="glass-card p-6 animate-slide-up">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
                1 · Select Modules
              </h2>
              <ModuleSelector selected={selectedModules} onChange={setSelectedModules} />
            </div>

            {selectedModules.length > 0 && (
              <div className="glass-card p-6 animate-slide-up">
                <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-5">
                  2 · Upload Files
                </h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  {selectedModules.map((mod) => {
                    const config = MODULE_FILE_CONFIG[mod];
                    return (
                      <FileUpload
                        key={mod}
                        fieldName={config.fieldName}
                        label={config.label}
                        description={config.description}
                        accept={config.accept}
                        onFile={handleFile}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {error && (
              <div className="px-4 py-3 rounded-xl bg-severity-critical-bg border border-severity-critical-border text-severity-critical text-sm animate-fade-in">
                {error}
              </div>
            )}

            {loading && (
              <div className="glass-card p-6 flex flex-col items-center gap-4 animate-fade-in">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-2 h-2 rounded-full bg-brand-400 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
                <p className="text-sm text-slate-400 animate-pulse-slow">
                  {LOADING_STEPS[loadingStep]}
                </p>
              </div>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                id="run-audit-btn"
                className="btn-primary text-base px-10 py-4"
                disabled={loading || selectedModules.length === 0}
              >
                {loading ? (
                  "Analysing…"
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Run Audit
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
