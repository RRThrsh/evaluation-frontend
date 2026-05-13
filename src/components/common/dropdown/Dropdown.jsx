import React, { useState } from "react";
import { DROPDOWN_STYLES } from "./Dropdown.styles";

export default function Dropdown({ label, options = [], onSelect }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative inline-block">
            <button
                className={DROPDOWN_STYLES.button}
                onClick={() => setOpen(!open)}
            >
            {label}
            </button>
        
            {open && (
                <ul className={DROPDOWN_STYLES.menu}>
                    {options.map((opt, i) => (
                        <li
                            key={i}
                            className={DROPDOWN_STYLES.item}
                            onClick={() => {
                            onSelect?.(opt);
                            setOpen(false);
                            }}
                        >
                            {opt.label || opt}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}