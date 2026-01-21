import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLanguageContext } from "./LanguageProvider";
import { useAppTheme } from "./ThemeProvider";

interface HiddenValueProps {
    readonly value: string;
    readonly isVisible?: boolean;
    readonly onShowCallback?: () => void;
}

export default function HiddenValue({ value, isVisible, onShowCallback }: HiddenValueProps) {
    const theme = useAppTheme();

    const { text } = useLanguageContext();

    const [showText, setShowText] = useState(false);

    useEffect(() => {
        setShowText(false);
    }, [value]);

    const handleShowText = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setShowText(true);
        onShowCallback?.();
    };

    const visible = isVisible || showText;

    return (
        <View style={styles.hiddenValueContainer}>
            {visible ? (
                <View style={[styles.hiddenTitleContainer, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.hiddenTitle, { color: theme.colors.onSurface}]} numberOfLines={3}>
                        {value}
                    </Text>
                </View>
            ) : (
                <TouchableOpacity style={[styles.eyeBtn, { backgroundColor: theme.colors.surface }]} onPress={handleShowText}>
                    <Ionicons name="eye-outline" size={22} color={theme.colors.onSurface} />
                    <Text style={[styles.eyeText, { color: theme.colors.onSurface }]}>{text("word_show_translation")}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    hiddenValueContainer: {
        marginVertical: 12,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
    },
    hiddenTitleContainer: {
        padding: 10,
        borderRadius: 12,
    },
    hiddenTitle: {
        fontSize: 20,
        fontWeight: "600",
        textAlign: "center",
    },
    eyeBtn: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    eyeText: {
        marginLeft: 6,
        fontWeight: "600",
        fontSize: 14,
    },
});