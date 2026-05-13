import React from "react";
import { card_styles } from "./card.styles";

export default function Card({ title, children, footer }) {
    return (
        <div className={card_styles.container}>
            {title && <h3 className={card_styles.title}>{title}</h3>}
            <div>{children}</div>
            {footer && <div className={card_styles.footer}>{footer}</div>}
        </div>
    );
}