import React from "react";
import { empty_state_styles } from "./emptystate.style";

export default function EmptyState({ title, description, action }) {
    return (
        <div className={empty_state_styles.container}>
            <h3 className={empty_state_styles.title}>{title}</h3>
            {description && (
                <p className={empty_state_styles.description}>{description}</p>
            )}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}