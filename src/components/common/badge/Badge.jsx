import React from "react";
import { badge_styles } from "./badge.style";

export default function Badge({ children, variant = "default" }) {
    return (
        <span className={badge_styles[variant]}>
            {children}
        </span>
    );
}