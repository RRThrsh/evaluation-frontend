import React from "react";
import { modal_styles } from "./modal.style";

export default function Modal({ isOpen, title, children, onClose }) {
    if (!isOpen) return null;

    return (
        <div className={modal_styles.overlay}>
            <div className={modal_styles.container}>
                <div className={modal_styles.header}>
                    <h2>{title}</h2>
                    <button onClick={onClose}>✕</button>
                </div>
                <div className={modal_styles.body}>{children}</div>
            </div>
        </div>
    );
}