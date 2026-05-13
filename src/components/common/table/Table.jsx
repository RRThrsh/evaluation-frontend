import React from "react";
import { TABLE_STYLES } from "./Table.styles";

export default function Table({ columns = [], data = [] }) {
    return (
        <div className="overflow-x-auto">
            <table className={TABLE_STYLES.table}>
                <thead className={TABLE_STYLES.head}>
                    <tr>
                        {columns.map((c) => (
                            <th key={c.key} className={TABLE_STYLES.th}>
                                {c.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                
                <tbody>
                    {data.map((row, i) => (
                        <tr key={i} className={TABLE_STYLES.tr}>
                            {columns.map((c) => (
                                <td key={c.key} className={TABLE_STYLES.td}>
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