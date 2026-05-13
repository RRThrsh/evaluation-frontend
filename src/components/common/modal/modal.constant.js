export const modalStyles = (variant) => {
    const base = {
        backdrop:
            "flex-1 bg-black/50 items-center justify-center px-6",
        container:
            "w-full bg-white rounded-2xl p-5",
        title: "text-lg font-semibold text-gray-900",
        description: "text-sm text-gray-500 mt-1 mb-4",
        actions: "flex-row justify-end mt-4 gap-2",
        closeArea: "mt-3 items-center",
        closeText: "text-gray-400 text-sm",
    };

    const variants = {
        default: {
            primaryButton:
                "px-4 py-2 bg-black rounded-lg",
            primaryText: "text-white font-medium",
            secondaryButton:
                "px-4 py-2 bg-gray-200 rounded-lg",
            secondaryText: "text-gray-800 font-medium",
        },

        danger: {
            primaryButton:
                "px-4 py-2 bg-red-600 rounded-lg",
            primaryText: "text-white font-medium",
            secondaryButton:
                "px-4 py-2 bg-gray-200 rounded-lg",
            secondaryText: "text-gray-800 font-medium",
        },
    };

    return {
        ...base,
        ...variants[variant || "default"],
    };
};