export const dropdownStyles = (variant) => {
    const variants = {
        default: {
            container: "w-full",
            button:
                "px-4 py-3 border border-gray-300 rounded-lg bg-white flex-row justify-between",
            buttonText: "text-gray-800",
            dropdown:
                "mt-2 border border-gray-200 rounded-lg bg-white overflow-hidden",
            item: "px-4 py-3 active:bg-gray-100",
            itemText: "text-gray-700",
        },
        primary: {
            container: "w-full",
            button:
                "px-4 py-3 border border-blue-300 rounded-lg bg-blue-50 flex-row justify-between",
            buttonText: "text-blue-800",
            dropdown:
                "mt-2 border border-blue-200 rounded-lg bg-white overflow-hidden",
            item: "px-4 py-3 active:bg-blue-50",
            itemText: "text-blue-700",
        },
    };

    return variants[variant] || variants.default;
};