export const spinnerStyles = (variant, size) => {
    const sizes = {
        sm: {
            indicatorSize: "small",
            wrapper: "p-2",
        },
        md: {
            indicatorSize: "small",
            wrapper: "p-3",
        },
        lg: {
            indicatorSize: "large",
            wrapper: "p-4",
        },
    };

    const variants = {
        default: {
            color: "#111827",
        },
        light: {
            color: "#ffffff",
        },
        primary: {
            color: "#2563eb",
        },
        danger: {
            color: "#dc2626",
        },
    };

    return {
        container: `items-center justify-center ${sizes[size]?.wrapper}`,
        fullscreen:
            "absolute inset-0 items-center justify-center bg-black/40",
        indicatorSize: sizes[size]?.indicatorSize || "small",
        color: variants[variant]?.color || variants.default.color,
    };
};