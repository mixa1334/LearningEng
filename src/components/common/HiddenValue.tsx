import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";
import { useHaptics } from "./HapticsProvider";
import { useLanguageContext } from "./LanguageProvider";
import { useAppTheme } from "./ThemeProvider";

interface HiddenValueProps {
    readonly value: string;
    readonly isVisible?: boolean;
    readonly onShowCallback?: () => void;
    readonly containerStyle?: any;
    readonly textStyle?: any;
}

export default function HiddenValue({ value, isVisible, onShowCallback, containerStyle, textStyle }: HiddenValueProps) {
    const theme = useAppTheme();
    const { lightImpact } = useHaptics();

    const { text } = useLanguageContext();

    const [showText, setShowText] = useState(false);

    useEffect(() => {
        setShowText(false);
    }, [value]);

    const handleShowText = () => {
        lightImpact();
        setShowText(true);
        onShowCallback?.();
    };

    const visible = isVisible || showText;

    return (
        <View style={[styles.hiddenValueContainer, containerStyle]}>
            {visible ? (
                <Animated.View 
                    entering={FadeIn.duration(400)}
                    style={styles.hiddenTitleContainer}
                >
                    <Text style={[styles.hiddenTitle, { color: theme.colors.primary }, textStyle]} numberOfLines={3}>
                        {value}
                    </Text>
                </Animated.View>
            ) : (
                <Animated.View entering={ZoomIn.duration(300)}>
                    <TouchableOpacity 
                        style={[styles.eyeBtn, { backgroundColor: theme.colors.surfaceVariant }]} 
                        onPress={handleShowText}
                    >
                        <Ionicons name="eye-outline" size={20} color={theme.colors.onSurfaceVariant} />
                        <Text style={[styles.eyeText, { color: theme.colors.onSurfaceVariant }]}>
                            {text("word_show_translation")}
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    hiddenValueContainer: {
        alignItems: "center",
        justifyContent: "center",
        width: '100%',
        height: 50,
    },
    hiddenTitleContainer: {
        alignItems: 'center',
        width: '100%',
    },
    hiddenTitle: {
        fontSize: 24,
        fontWeight: "600",
        textAlign: "center",
    },
    eyeBtn: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 50,
        gap: 8,
    },
    eyeText: {
        fontWeight: "600",
        fontSize: 14,
    },
});
