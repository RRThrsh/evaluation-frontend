export default function StatCard({ title, value, icon: Icon, color, bg }) {
    return (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex justify-between">

                <div>
                    <p className="text-sm text-slate-400">{title}</p>
                    <h2 className="mt-3 text-4xl font-bold">{value}</h2>
                </div>

                <div className={`rounded-2xl p-4 ${bg}`}>
                    <Icon size={26} className={color} />
                </div>

            </div>
        </div>
    );
}