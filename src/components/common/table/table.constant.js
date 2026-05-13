export const tableStyles = (variant) => {
    const base = {
        container: "min-w-full",
        headerRow:
            "flex-row bg-gray-100 border-b border-gray-200",
        headerCell:
            "px-4 py-3 text-sm font-semibold text-gray-700 min-w-[120px]",
        row:
            "flex-row border-b border-gray-100 active:bg-gray-50",
        cell:
            "px-4 py-3 text-sm text-gray-800 min-w-[120px]",
    };

    const variants = {
        default: {},
        striped: {
            row: "flex-row border-b border-gray-100 even:bg-gray-50 active:bg-gray-100",
        },
        compact: {
            headerCell: "px-3 py-2 text-xs font-semibold",
            cell: "px-3 py-2 text-xs",
        },
    };

    const v = variants[variant] || {};

    return {
        container: base.container,
        headerRow: base.headerRow,
        headerCell: v.headerCell || base.headerCell,
        row: v.row || base.row,
        cell: v.cell || base.cell,
    };
};