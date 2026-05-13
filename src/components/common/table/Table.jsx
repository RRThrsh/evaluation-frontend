import React from "react";
import { table_styles } from "./table.style";

export default function Table({ columns = [], data = [] }) {
    return (
        <div className="overflow-x-auto">
            <table className={table_styles.table}>
                <thead className={table_styles.head}>
                    <tr>
                        {columns.map((c) => (
                            <th key={c.key} className={table_styles.th}>
                                {c.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                
                <tbody>
                    {data.map((row, i) => (
                        <tr key={i} className={table_styles.tr}>
                            {columns.map((c) => (
                                <td key={c.key} className={table_styles.td}>
                                    {row[c.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}