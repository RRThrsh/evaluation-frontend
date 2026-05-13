import React from "react";
import { View, Text, Pressable } from "react-native";
import { emptyStateStyles } from "./emptystate.constant";
import { EmptyStatePropTypes } from "./emptystate.types";

const EmptyState = ({
    title = "No data found",
    description,
    actionLabel,
    onAction,
    variant = "default",
}) => {
    const styles = emptyStateStyles(variant);

    return (
        <View className={styles.container}>
            <Text className={styles.title}>{title}</Text>

            {description ? (
                <Text className={styles.description}>{description}</Text>
            ) : null}

            {actionLabel && onAction ? (
                <Pressable onPress={onAction} className={styles.button}>
                    <Text className={styles.buttonText}>{actionLabel}</Text>
                </Pressable>
            ) : null}
        </View>
    );
};

EmptyState.propTypes = EmptyStatePropTypes;

export default EmptyState;