import React, { useState } from "react";
import { inputVariants } from "./inputfield.types";
import { inputSizes } from "./inputfield.constant";
import {
    baseInputStyles,
    labelStyles,
    errorTextStyles,
} from "./inputfield.style";

const InputField = ({
    label,
    type = "text",
    name,
    value,
    onChange,
    placeholder,
    error,
    size = "md",
    variant = "default",
    className = ""
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPasswordField = type === "password";
    const inputType = isPasswordField
        ? showPassword
            ? "text"
            : "password"
        : type;
    
    const appliedVariant = error ? "error" : variant;

    return (
        <div className="flex flex-col gap-1 w-full">
            {label && <label className={labelStyles}>{label}</label>}
            <div className="relative">
                <input 
                type={inputType}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`
                    ${baseInputStyles}
                    ${inputSizes[size]}
                    ${inputVariants[appliedVariant]}
                    ${className}
                `}
                />
                {/* TOGGLE PASSWORD VISIBILITY */}
                {isPasswordField && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-gray-900"
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                )}
            </div>
            {error && <span className={errorTextStyles}></span>}
        </div>
    );
};

export default InputField;