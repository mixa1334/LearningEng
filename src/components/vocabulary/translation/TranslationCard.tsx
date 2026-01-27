import { useHaptics } from "@/src/components/common/HapticsProvider";
import { useLanguageContext } from "@/src/components/common/LanguageProvider";
import { useSoundPlayer } from "@/src/components/common/SoundProvider";
import { useAppTheme } from "@/src/components/common/ThemeProvider";
import { Language, Translation } from "@/src/entity/types";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Card, IconButton, Text } from "react-native-paper";

interface TranslationCardProps {
    readonly translation: Translation;
}

export default function TranslationCard({ translation }: TranslationCardProps) {
    const { removeTranslation } = useTranslation();
    const theme = useAppTheme();
    const router = useRouter();
    const { playTap } = useSoundPlayer();
    const { text } = useLanguageContext();
    const { mediumImpact } = useHaptics();
    const [translatedText, setTranslatedText] = useState<string | undefined>(undefined);

    const saveToVocabulary = () => {
        if (!translatedText) return;
        playTap();
        const { word_ru, word_en } = translation.text_language === Language.ENGLISH ?
            { word_ru: translatedText, word_en: translation.text } : { word_ru: translation.text, word_en: translatedText };
        router.push({
            pathname: "./save-translation",
            params: {
                word_ru,
                word_en,
            },
        });
        setTranslatedText(undefined);
    };

    const handleRemoveTranslation = () => {
        mediumImpact();
        removeTranslation(translation.id);
    };

    return (
        <Card style={[styles.historyCard, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Card.Title
                title={translation.text_language === Language.ENGLISH ? text("translation_card_title_en_ru") : text("translation_card_title_ru_en")}
                titleStyle={{ color: theme.colors.onSurfaceVariant, textAlign: "center" }}
            />
            <Card.Content
                style={{
                    flexDirection: "column",
                    gap: 15,
                    marginVertical: 15,
                }}
            >
                <Text style={{ fontSize: 23, fontWeight: "900", textAlign: "center" }}>
                    {translation.text}
                </Text>
                <Text style={{ fontSize: 12, color: theme.colors.onSurfaceVariant }}>{text("translation_card_translations_label")}:</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, alignItems: "center", justifyContent: "center" }}>
                    {
                        translation.translated_array.map((t, index) => (
                            <Pressable
                                onPress={() => setTranslatedText(t)}
                                key={index.toString() + t}
                                disabled={translatedText === t}
                                style={({ pressed }) => [
                                    {
                                        backgroundColor: translatedText === t ? theme.colors.accept : theme.colors.secondary,
                                        padding: 8,
                                        borderRadius: 4,
                                    },
                                    pressed && {
                                        opacity: 0.8,
                                        transform: [{ scale: 0.97 }],
                                    },
                                ]}
                            >
                                <Text style={{ color: translatedText === t ? theme.colors.onAcceptReject : theme.colors.onSecondary }}>{t}</Text>
                            </Pressable>
                        ))
                    }
                </View>
            </Card.Content>
            <Card.Actions style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
                <IconButton
                    icon="close"
                    onPress={handleRemoveTranslation}
                    containerColor={theme.colors.error}
                    iconColor={theme.colors.onError}
                    size={24}
                    accessibilityLabel={text("translation_clear_translation_accessibility")}
                />
                <IconButton
                    style={{ alignSelf: "center" }}
                    disabled={!translatedText}
                    icon="plus"
                    onPress={saveToVocabulary}
                    containerColor="#81c784"
                    iconColor="#1b5e20"
                    size={24}
                    accessibilityLabel={text("translation_add_to_vocabulary_accessibility")}
                />
            </Card.Actions>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        marginBottom: 30,
    },
    input: {
        marginTop: 12,
        marginBottom: 12,
    },
    result: {
        fontSize: 22,
        fontWeight: "700",
        marginTop: 8,
    },
    actions: {
        justifyContent: "space-between",
        marginTop: 12,
    },
    historyCard: {
        borderRadius: 20,
    },
});