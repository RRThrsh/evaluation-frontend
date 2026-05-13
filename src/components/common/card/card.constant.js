export const cardStyles = (variant) => {
    const base = {
        container:
            "rounded-xl p-4 shadow-sm border border-gray-200 bg-white",
        title: "text-base font-semibold text-gray-900 mb-1",
        description: "text-sm text-gray-600",
    };

    const variants = {
        default: "",
        elevated: "shadow-md",
        outlined: "border-2 border-gray-300 shadow-none",
        primary: "bg-blue-50 border-blue-200",
    };

    return {
        container: `${base.container} ${variants[variant] || ""}`,
        title: base.title,
        description: base.description,
    };
};