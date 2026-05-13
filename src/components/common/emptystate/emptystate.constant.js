export const emptyStateStyles = (variant) => {
    const variants = {
        default: {
            container: "flex-1 items-center justify-center px-6",
            title: "text-lg font-semibold text-gray-800 text-center",
            description: "text-sm text-gray-500 text-center mt-2",
            button:
                "mt-4 px-4 py-2 bg-gray-900 rounded-lg active:opacity-80",
            buttonText: "text-white text-sm font-medium",
        },
    
        subtle: {
            container: "flex-1 items-center justify-center px-6",
            title: "text-base font-medium text-gray-700 text-center",
            description: "text-sm text-gray-400 text-center mt-2",
            button:
                "mt-4 px-4 py-2 bg-gray-200 rounded-lg active:opacity-80",
            buttonText: "text-gray-800 text-sm font-medium",
        },
    };

    return variants[variant] || variants.default;
};