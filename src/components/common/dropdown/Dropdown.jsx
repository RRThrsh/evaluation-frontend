import React, { useState } from "react";
import { dropdown_styles } from "./dropdown.style";

export default function Dropdown({ label, options = [], onSelect }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative inline-block">
            <button
                className={dropdown_styles.button}
                onClick={() => setOpen(!open)}
            >
            {label}
            </button>
        
            {open && (
                <ul className={dropdown_styles.menu}>
                    {options.map((opt, i) => (
                        <li
                            key={i}
                            className={dropdown_styles.item}
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