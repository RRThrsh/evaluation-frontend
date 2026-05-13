import React from "react";
import { SPINNER_STYLES } from "./Spinner.styles";

export default function Spinner({ size = 24 }) {
    return (
        <div
            className={SPINNER_STYLES.base}
            style={{ width: size, height: size }}
        />
    );
}