import { useEffect } from "react";

export default function ConfirmModal({ title, message, extra, confirmLabel = "Confirm", confirmVariant = "primary", onConfirm, onCancel }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onCancel]);

  const confirmClass = confirmVariant === "danger"
    ? "btn btn-danger btn-md"
    : "btn btn-primary btn-md";

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content max-w-sm p-6 text-center" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 mb-6">{message}{extra && <span className="block mt-1 font-medium">{extra}</span>}</p>
        <div className="flex gap-3">
          <button onClick={onConfirm} className={`flex-1 ${confirmClass}`}>{confirmLabel}</button>
          <button onClick={onCancel} className="flex-1 btn btn-secondary btn-md">Cancel</button>
        </div>
      </div>
    </div>
  );
}
