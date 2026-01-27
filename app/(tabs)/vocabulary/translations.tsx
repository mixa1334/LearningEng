import { useHaptics } from "@/src/components/common/HapticsProvider";
import { useLanguageContext } from "@/src/components/common/LanguageProvider";
import { useAppTheme } from "@/src/components/common/ThemeProvider";
import TranslationsList from "@/src/components/vocabulary/translation/TranslationsList";
import { useTranslation } from "@/src/hooks/useTranslation";
import { SPACING_LG, SPACING_XS, TAB_BAR_BASE_HEIGHT } from "@/src/resources/constants/layout";
import { userAlerts } from "@/src/util/userAlerts";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { IconButton } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TranslationsPage() {
    const theme = useAppTheme();
    const insets = useSafeAreaInsets();


    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingTop: SPACING_LG,
                    paddingBottom: insets.bottom + TAB_BAR_BASE_HEIGHT,
                    paddingHorizontal: SPACING_XS,
                }}
            >
                <TranslationsList />
            </ScrollView>
        </View>
    );
}

export function ClearHistoryButton() {
    const { text } = useLanguageContext();
    const theme = useAppTheme();
    const { clearTranslations } = useTranslation();
    const { heavyImpact } = useHaptics();

    const handleClearHistory = () => {
        heavyImpact();
        userAlerts.sendUserImportantConfirmation(
            text("common_action_permanent_title"),
            text("translation_clear_history_confirm_message"),
            () => {
                clearTranslations();
                userAlerts.sendUserAlert(text("translation_clear_history_success"));
            }
        );
    };

    return (
        <IconButton
            icon="trash-can-outline"
            onPress={handleClearHistory}
            iconColor={theme.colors.error}
            size={24}
            accessibilityLabel={text("translation_clear_history_accessibility")}
        />
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    clearHistoryButton: {
        position: "absolute",
        right: 0,
        top: 0,
        zIndex: 100,
    },
});