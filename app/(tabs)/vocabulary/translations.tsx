import { useHaptics } from "@/src/components/common/HapticsProvider";
import { useLanguageContext } from "@/src/components/common/LanguageProvider";
import { useAppTheme } from "@/src/components/common/ThemeProvider";
import TranslationsList from "@/src/components/vocabulary/translation/TranslationsList";
import { useTranslation } from "@/src/hooks/useTranslation";
import { SPACING_MD, SPACING_SM, SPACING_XS, TAB_BAR_BASE_HEIGHT } from "@/src/resources/constants/layout";
import { userAlerts } from "@/src/util/UserAlerts";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { IconButton } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TranslationsPage() {
    const theme = useAppTheme();
    const insets = useSafeAreaInsets();
    const { text } = useLanguageContext();
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
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View
                style={[
                    styles.navbar,
                    {
                        backgroundColor: theme.colors.surfaceVariant,
                        borderColor: theme.colors.onSurfaceVariant,
                    },
                ]}
            >
                <IconButton
                    icon="trash-can"
                    onPress={handleClearHistory}
                    iconColor={theme.colors.onError}
                    containerColor={theme.colors.error}
                    size={18}
                    accessibilityLabel={text("translation_clear_history_accessibility")}
                />


            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                    // 60 is the height of the navbar
                    paddingTop: SPACING_MD + 60,
                    paddingBottom: insets.bottom + TAB_BAR_BASE_HEIGHT,
                    paddingHorizontal: SPACING_XS,
                }}
            >
                <TranslationsList />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    navbar: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 60,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: SPACING_SM,
        borderBottomEndRadius: 20,
        borderBottomStartRadius: 20,
        zIndex: 100,
        gap: SPACING_MD,
    },
});