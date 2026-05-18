export default function ConfirmModal({ title, message, extra, confirmLabel, confirmColor, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onCancel}>
      <div className="bg-white w-full max-w-sm rounded-xl shadow-lg p-6 text-center" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-sm text-slate-600 mb-6">{message}{extra && <span className="block mt-1 font-medium">{extra}</span>}</p>
        <div className="flex gap-3">
          <button onClick={onConfirm} className={`flex-1 py-2 rounded-lg text-sm font-bold text-white ${confirmColor || "bg-indigo-600 hover:bg-indigo-700"}`}>
            {confirmLabel || "Yes"}
          </button>
          <button onClick={onCancel} className="flex-1 bg-zinc-200 text-zinc-700 py-2 rounded-lg text-sm font-bold hover:bg-zinc-300">
            No
          </button>
        </div>
      </div>
    </div>
  );
}
