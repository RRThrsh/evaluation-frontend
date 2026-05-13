export const badgeStyles = (variant, size) => {
    const base =
        "rounded-full font-medium text-center self-start";

    const variants = {
        default: "bg-gray-200 text-gray-800",
        success: "bg-green-100 text-green-800",
        warning: "bg-yellow-100 text-yellow-800",
        error: "bg-red-100 text-red-800",
    };

    const sizes = {
        sm: "px-2 py-0.5 text-xs",
        md: "px-3 py-1 text-sm",
        lg: "px-4 py-1.5 text-base",
    };

    return `${base} ${variants[variant] || variants.default} ${
        sizes[size] || sizes.md
    }`;
};