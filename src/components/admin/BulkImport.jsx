import { useState, useRef } from "react";
import api from "../../services/api";
import { sanitizeObject } from "../../utils/sanitize";

function SvgIcon({ path, className = "w-5 h-5" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

export default function BulkImport() {
  const fileRef = useRef();
  const [students, setStudents] = useState([]);
  const [parsing, setParsing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setParsing(true);
    setResult(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      const lines = text.split("\n").filter((l) => l.trim());
      if (lines.length < 2) {
        showToast("CSV must have a header row and at least one data row");
        setParsing(false);
        return;
      }

      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
      const required = ["first_name", "last_name", "email"];
      const missing = required.filter((r) => !headers.includes(r));
      if (missing.length > 0) {
        showToast(`Missing required columns: ${missing.join(", ")}`);
        setParsing(false);
        return;
      }

      const parsed = [];
      for (let i = 1; i < lines.length; i++) {
        const vals = lines[i].split(",").map((v) => v.trim());
        const row = {};
        headers.forEach((h, idx) => { row[h] = vals[idx] || ""; });
        parsed.push(row);
      }
      setStudents(parsed);
      setParsing(false);
      showToast(`Parsed ${parsed.length} students from CSV`, "success");
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (students.length === 0) return;
    setImporting(true);
    try {
      const res = await api.post("/api/admin/students/import", { students: students.map(sanitizeObject) });
      setResult(res);
      showToast(res.message || "Import complete", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Bulk Student Import</h2>
        <p className="text-sm text-slate-500 mt-1">Upload a CSV file to import multiple students at once</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl p-8 cursor-pointer hover:border-blue-400 transition">
          <SvgIcon path="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" className="w-10 h-10 text-slate-300 mb-3" />
          <p className="text-sm font-medium text-slate-500">{parsing ? "Parsing..." : "Click to select CSV file"}</p>
          <p className="text-xs text-slate-400 mt-1">Required columns: first_name, last_name, email</p>
          <input ref={fileRef} type="file" accept=".csv" onChange={handleFile} className="hidden" />
        </label>
      </div>

      {students.length > 0 && !result && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-800">{students.length} students ready</span>
            <button onClick={handleImport} disabled={importing}
              className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition disabled:opacity-50">
              {importing ? "Importing..." : "Import All"}
            </button>
          </div>
          <div className="overflow-x-auto max-h-80 overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  {Object.keys(students[0]).map((h) => (
                    <th key={h} className="text-left px-4 py-2 text-[10px] font-semibold uppercase text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.slice(0, 50).map((s, i) => (
                  <tr key={i}>
                    {Object.values(s).map((v, j) => (
                      <td key={j} className="px-4 py-2 text-xs text-slate-600 max-w-[150px] truncate">{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {students.length > 50 && <p className="text-xs text-slate-400 text-center py-2">Showing 50 of {students.length} rows</p>}
          </div>
        </div>
      )}

      {result && (
        <div className={`rounded-2xl border p-5 ${result.errors?.length > 0 ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`}>
          <p className="text-sm font-semibold mb-2">{result.message}</p>
          <p className="text-xs text-slate-600">Errors: {result.errors?.length || 0}</p>
          {result.errors?.length > 0 && (
            <div className="mt-3 max-h-40 overflow-y-auto">
              {result.errors.map((e, i) => (
                <p key={i} className="text-xs text-red-500">Row {e.row}: {e.message}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>{toast.msg}</div>
      )}
    </div>
  );
}
