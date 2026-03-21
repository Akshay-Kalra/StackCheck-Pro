import { useRef, useState } from "react";

const ICONS = {
  upload: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  ),
  file: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
    </svg>
  ),
  check: (
    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
};

export default function FileUpload({ label, description, accept, fieldName, onFile }) {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  function handleFile(f) {
    if (!f) return;
    setFile(f);
    onFile(fieldName, f);
  }

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  function onInputChange(e) {
    const f = e.target.files[0];
    if (f) handleFile(f);
  }

  const zoneClass = `input-file-zone ${dragging ? "active" : ""} ${file ? "has-file" : ""}`;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-300">{label}</span>
        {accept && (
          <span className="text-xs text-slate-500 font-mono bg-surface-700 px-2 py-0.5 rounded-md">
            {accept}
          </span>
        )}
      </div>
      {description && (
        <p className="text-xs text-slate-500">{description}</p>
      )}
      <div
        id={`upload-zone-${fieldName}`}
        className={zoneClass}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={onInputChange}
          id={`file-input-${fieldName}`}
        />
        {file ? (
          <div className="flex items-center gap-2 text-sm">
            {ICONS.check}
            <span className="text-emerald-400 font-medium">{file.name}</span>
            <span className="text-slate-500">({(file.size / 1024).toFixed(1)} KB)</span>
          </div>
        ) : (
          <>
            <span className="text-slate-500">{ICONS.upload}</span>
            <div>
              <p className="text-sm text-slate-400">
                <span className="text-brand-400 font-medium">Click to browse</span> or drag & drop
              </p>
              <p className="text-xs text-slate-600 mt-0.5">Max 5 MB</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
