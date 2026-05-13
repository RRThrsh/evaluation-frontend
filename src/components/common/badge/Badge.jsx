import React from "react";
import { Text, Pressable } from "react-native";
import { badgeStyles } from "./badge.constant";
import { BadgePropTypes } from "./badge.types";

const Badge = ({ label, variant = "default", size = "md", onPress }) => {
    const styles = badgeStyles(variant, size);
    
    const Wrapper = onPress ? Pressable : React.Fragment;
    
    return (
        <Wrapper {...(onPress ? { onPress } : {})}>
            <Text className={styles}>{label}</Text>
        </Wrapper>
    );
};

Badge.propTypes = BadgePropTypes;

export default Badge;