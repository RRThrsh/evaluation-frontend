import React from "react";
import { spinner_styles } from "./spinner.style";

export default function Spinner({ size = 24 }) {
    return (
        <div
            className={spinner_styles.base}
            style={{ width: size, height: size }}
        />
    );
}