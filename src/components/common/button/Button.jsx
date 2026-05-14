import React from "react";
import { buttonVariants } from "./button.types";
import { buttonSizes } from "./button.constant";
import { baseButtonStyles, disabledStyles } from "./button.style";

const Spinner = () => (
    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
);

const Button = ({
    children,
    onClick,
    type = "button",
    variant = "primary",
    size = "md",
    disabled = false,
    loading = false,
    leftIcon,
    rightIcon,
    className = "",
}) => {
    const isDisabled = disabled || loading;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            className={`
                ${baseButtonStyles}
                ${buttonSizes[size]}
                ${buttonVariants[variant]}
                ${isDisabled ? disabledStyles : ""}
                ${className}
            `}
        >
            {loading && <Spinner />}

            {!loading && leftIcon && <span>{leftIcon}</span>}

            <span>{children}</span>

            {!loading && rightIcon && <span>{rightIcon}</span>}
        </button>
    );
};

export default Button;