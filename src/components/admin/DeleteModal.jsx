import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

export default function DeleteModal({ isOpen, onClose, onConfirm, tableName, rowId, deleting }) {
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  useEffect(() => { if (isOpen) setStep(1); }, [isOpen]);

  if (!isOpen) return null;

  if (step === 1) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Delete Record</h3>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">{tableName} &middot; ID: {rowId}</p>
            </div>
          </div>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            Delete this record from <span className="font-semibold text-slate-700">{tableName}</span>?
          </p>
          <div className="flex gap-3 justify-end">
            <button onClick={onClose} className="btn btn-secondary btn-md">Cancel</button>
            <button onClick={() => setStep(2)} className="btn btn-primary btn-md">Continue</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Confirm Delete</h3>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">{tableName} &middot; ID: {rowId}</p>
          </div>
        </div>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          This action <span className="font-semibold text-slate-700">cannot be undone</span>. Are you sure you want to permanently delete this record?
        </p>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="btn btn-secondary btn-md">Cancel</button>
          <button onClick={onConfirm} disabled={deleting} className="btn btn-danger btn-md">{deleting ? "Deleting..." : "Delete"}</button>
        </div>
      </div>
    </div>
  );
}
