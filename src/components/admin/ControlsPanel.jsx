import SvgIcon from "../common/SvgIcon";

export default function ControlsPanel({ controls, onToggle }) {
  return (
    <div className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Controls</h3>
          <p className="mt-1 text-sm text-slate-500">Toggle system modules</p>
        </div>
        <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
          <SvgIcon path="M13 10V3L4 14h7v7l9-11h-7z" className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-6 space-y-4">
        {controls.map((item, i) => (
          <div key={i} className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-slate-700">{item.label}</p>
              <p className="text-xs text-slate-400">{item.state}</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" className="peer sr-only" checked={item.state === "Enabled"} onChange={() => onToggle(item.label, item.state)} />
              <div className="h-6 w-11 rounded-full bg-slate-200 transition peer-checked:bg-blue-600 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full" />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
