import React from "react";
import { View, Text, Pressable } from "react-native";
import { cardStyles } from "./card.constant";
import { CardPropTypes } from "./card.types";

const Card = ({
    title,
    description,
    children,
    onPress,
    variant = "default",
    className = "",
}) => {
    const styles = cardStyles(variant);

    const Wrapper = onPress ? Pressable : View;

    return (
        <Wrapper onPress={onPress} className={`${styles.container} ${className}`}>
            {title ? <Text className={styles.title}>{title}</Text> : null}

            {description ? (
                <Text className={styles.description}>{description}</Text>
            ) : null}

            {children}
        </Wrapper>
    );
};

Card.propTypes = CardPropTypes;

export default Card;