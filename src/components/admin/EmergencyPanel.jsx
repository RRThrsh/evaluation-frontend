import SvgIcon from "../common/SvgIcon";

export default function EmergencyPanel({ onShutdown }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-red-600">Emergency</h3>
          <p className="mt-1 text-sm text-red-400">Critical system actions</p>
        </div>
        <div className="rounded-2xl bg-red-100 p-3 text-red-600">
          <SvgIcon path="M12 9v2m0 4h.01" className="w-5 h-5" />
        </div>
      </div>
      <button onClick={onShutdown} className="mt-8 w-full rounded-2xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white">
        Shutdown System
      </button>
    </div>
  );
}
