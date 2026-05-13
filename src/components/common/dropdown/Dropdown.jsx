import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { dropdownStyles } from "./dropdown.constant";
import { DropdownPropTypes } from "./dropdown.types";

const Dropdown = ({
    label = "Select an option",
    options = [],
    value,
    onChange,
    variant = "default",
}) => {
    const [open, setOpen] = useState(false);

    const styles = dropdownStyles(variant);

    const selectedLabel =
        options.find((opt) => opt.value === value)?.label || label;

    const handleSelect = (option) => {
        onChange?.(option.value);
        setOpen(false);
    };

    return (
        <View className={styles.container}>
            <Pressable
                onPress={() => setOpen((prev) => !prev)}
                className={styles.button}
            >
                <Text className={styles.buttonText}>{selectedLabel}</Text>
            </Pressable>

            {open && (
                <View className={styles.dropdown}>
                    {options.map((option) => (
                        <Pressable
                            key={option.value}
                            onPress={() => handleSelect(option)}
                            className={styles.item}
                        >
                            <Text className={styles.itemText}>{option.label}</Text>
                        </Pressable>
                    ))}
                </View>
            )}
        </View>
    );
};

Dropdown.propTypes = DropdownPropTypes;

export default Dropdown;