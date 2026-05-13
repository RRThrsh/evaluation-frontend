import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { tableStyles } from "./table.constant";
import { TablePropTypes } from "./table.types";

const Table = ({
    columns = [],
    data = [],
    onRowPress,
    variant = "default",
}) => {
    const styles = tableStyles(variant);

    return (
        <ScrollView horizontal>
            <View className={styles.container}>
              {/* Header */}
                <View className={styles.headerRow}>
                    {columns.map((col) => (
                        <Text key={col.key} className={styles.headerCell}>
                            {col.title}
                        </Text>
                    ))}
                </View>
            
              {/* Rows */}
                {data.map((row, rowIndex) => {
                    const RowWrapper = onRowPress ? Pressable : View;
                    
                    return (
                        <RowWrapper
                            key={rowIndex}
                            onPress={() => onRowPress?.(row)}
                            className={styles.row}
                        >
                            {columns.map((col) => (
                                <Text key={col.key} className={styles.cell}>
                                    {row[col.key]}
                                </Text>
                            ))}
                        </RowWrapper>
                    );
                })}
            </View>
        </ScrollView>
    );
};

Table.propTypes = TablePropTypes;

export default Table;