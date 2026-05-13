import React from "react";
import { BADGE_STYLES } from "./Badge.styles";

export default function Badge({ children, variant = "default" }) {
    return (
        <span className={BADGE_STYLES[variant]}>
            {children}
        </span>
    );
}