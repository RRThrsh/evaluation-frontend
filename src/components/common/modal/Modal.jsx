import React from "react";
import { Modal as RNModal, View, Text, Pressable } from "react-native";
import { modalStyles } from "./modal.constant";
import { ModalPropTypes } from "./modal.types";

const Modal = ({
    visible,
    title,
    description,
    children,
    onClose,
    primaryAction,
    secondaryAction,
    variant = "default",
}) => {
    const styles = modalStyles(variant);

    return (
        <RNModal transparent visible={visible} animationType="fade">
            <View className={styles.backdrop}>
                <View className={styles.container}>
                    {title ? <Text className={styles.title}>{title}</Text> : null}

                    {description ? (
                        <Text className={styles.description}>{description}</Text>
                    ) : null}

                    {children}
                
                    <View className={styles.actions}>
                        {secondaryAction ? (
                            <Pressable
                                onPress={secondaryAction.onPress}
                                className={styles.secondaryButton}
                            >
                                <Text className={styles.secondaryText}>
                                    {secondaryAction.label}
                                </Text>
                            </Pressable>
                        ) : null}

                        {primaryAction ? (
                            <Pressable
                                onPress={primaryAction.onPress}
                                className={styles.primaryButton}
                            >
                                <Text className={styles.primaryText}>
                                    {primaryAction.label}
                                </Text>
                            </Pressable>
                        ) : null}
                    </View>
                    
                    {onClose ? (
                        <Pressable onPress={onClose} className={styles.closeArea}>
                            <Text className={styles.closeText}>close</Text>
                        </Pressable>
                    ) : null}
                </View>
            </View>
        </RNModal>
    );
};

Modal.propTypes = ModalPropTypes;

export default Modal;