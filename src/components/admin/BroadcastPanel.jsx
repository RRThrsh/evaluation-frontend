import SvgIcon from "../common/SvgIcon";

export default function BroadcastPanel({ broadcast, setBroadcast, onSend }) {
  return (
    <div className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Broadcast</h3>
          <p className="mt-1 text-sm text-slate-500">Send announcement to all users</p>
        </div>
        <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
          <SvgIcon path="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" className="w-5 h-5" />
        </div>
      </div>
      <div className="relative mt-5">
        <textarea
          value={broadcast}
          onChange={(e) => setBroadcast(e.target.value)}
          className="w-full border border-slate-200 rounded-xl p-3 pr-12 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
          placeholder="Type announcement..." rows={3} maxLength={500}
        />
        <span className="absolute bottom-3 right-3 text-[10px] text-slate-300">{broadcast.length}/500</span>
      </div>
      <button
        onClick={onSend}
        disabled={!broadcast.trim()}
        className="mt-5 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:scale-[1.01] disabled:opacity-40"
      >
        Send Broadcast
      </button>
    </div>
  );
}
