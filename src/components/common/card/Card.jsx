import React from "react";
import { CARD_STYLES } from "./Card.styles";

export default function Card({ title, children, footer }) {
    return (
        <div className={CARD_STYLES.container}>
            {title && <h3 className={CARD_STYLES.title}>{title}</h3>}
            <div>{children}</div>
            {footer && <div className={CARD_STYLES.footer}>{footer}</div>}
        </div>
    );
}