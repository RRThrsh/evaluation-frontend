export default function SkeletonRows({ columns = 5, rows = 5 }) {
    return (
        <>
            {Array.from({ length: rows }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                    {Array.from({ length: columns }).map((_, j) => (
                        <td key={j} className="px-5 py-3">
                            <div
                                className="h-3 bg-slate-200 rounded"
                                style={{ width: `${50 + Math.random() * 40}%` }}
                            />
                        </td>
                    ))}
                    <td className="px-5 py-3">
                        <div className="h-3 bg-slate-200 rounded w-10" />
                    </td>
                </tr>
            ))}
        </>
    );
}
