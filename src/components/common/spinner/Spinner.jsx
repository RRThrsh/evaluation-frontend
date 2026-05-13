import React from "react";
import { View, ActivityIndicator } from "react-native";
import { spinnerStyles } from "./spinner.constant";
import { SpinnerPropTypes } from "./spinner.types";

const Spinner = ({
    size = "md",
    variant = "default",
    fullscreen = false,
}) => {
    const styles = spinnerStyles(variant, size);

    const content = (
        <ActivityIndicator
            size={styles.indicatorSize}
            color={styles.color}
        />
    );

    if (fullscreen) {
        return <View className={styles.fullscreen}>{content}</View>;
    }

    return <View className={styles.container}>{content}</View>;
};

Spinner.propTypes = SpinnerPropTypes;

export default Spinner;