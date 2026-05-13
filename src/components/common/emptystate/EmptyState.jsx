import React from "react";
import { EMPTY_STATE_STYLES } from "./EmptyState.styles";

export default function EmptyState({ title, description, action }) {
    return (
        <div className={EMPTY_STATE_STYLES.container}>
            <h3 className={EMPTY_STATE_STYLES.title}>{title}</h3>
            {description && (
                <p className={EMPTY_STATE_STYLES.description}>{description}</p>
            )}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}