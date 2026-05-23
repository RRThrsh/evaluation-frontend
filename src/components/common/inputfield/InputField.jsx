import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { inputVariants } from "./inputfield.types";
import { inputSizes } from "./inputfield.constant";
import { baseInputStyles, labelStyles, errorTextStyles } from "./inputfield.style";

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
  className = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";
  const inputType = isPasswordField ? (showPassword ? "text" : "password") : type;
  const appliedVariant = error ? "error" : variant;

  return (
    <div className="w-full">
      {label && <label htmlFor={name} className={labelStyles}>{label}</label>}
      <div className="relative">
        <input
          id={name}
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${baseInputStyles} ${inputSizes[size]} ${appliedVariant === "error" ? "error" : ""} ${className}`}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <p className={errorTextStyles}>{error}</p>}
    </div>
  );
};

export default InputField;
