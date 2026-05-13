import React from "react";
import { MODAL_STYLES } from "./Modal.styles";

export default function Modal({ isOpen, title, children, onClose }) {
    if (!isOpen) return null;

    return (
        <div className={MODAL_STYLES.overlay}>
            <div className={MODAL_STYLES.container}>
                <div className={MODAL_STYLES.header}>
                    <h2>{title}</h2>
                    <button onClick={onClose}>✕</button>
                </div>
                <div className={MODAL_STYLES.body}>{children}</div>
            </div>
        </div>
    );
}