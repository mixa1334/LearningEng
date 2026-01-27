import { getCardShadow } from "@/src/components/common/cardShadow";
import { useHaptics } from "@/src/components/common/HapticsProvider";
import { useLanguageContext } from "@/src/components/common/LanguageProvider";
import { useSoundPlayer } from "@/src/components/common/SoundProvider";
import { useAppTheme } from "@/src/components/common/ThemeProvider";
import { Language, Translation } from "@/src/entity/types";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Animated, PanResponder, Pressable, StyleSheet, View } from "react-native";
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
    const translateX = useRef(new Animated.Value(0)).current;
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const deleteVisibleRef = useRef(false);
    const offsetRef = useRef(0);

    const MIN_TRANSLATE_X = -80;
    const REVEAL_THRESHOLD = -20;
    const OPEN_THRESHOLD = MIN_TRANSLATE_X / 2; // -40

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_evt, gestureState) =>
                Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dy) < 10,
            onPanResponderMove: (_evt, { dx }) => {
                let newX = offsetRef.current + dx;
                if (newX > 0) newX = 0;
                if (newX < MIN_TRANSLATE_X) newX = MIN_TRANSLATE_X;

                translateX.setValue(newX);

                const shouldShow = newX <= REVEAL_THRESHOLD;
                if (shouldShow !== deleteVisibleRef.current) {
                    deleteVisibleRef.current = shouldShow;
                    setShowDeleteButton(shouldShow);
                }
            },
            onPanResponderRelease: (_evt, { dx }) => {
                let newX = offsetRef.current + dx;
                if (newX > 0) newX = 0;
                if (newX < MIN_TRANSLATE_X) newX = MIN_TRANSLATE_X;

                const shouldOpen = newX <= OPEN_THRESHOLD;
                const targetX = shouldOpen ? MIN_TRANSLATE_X : 0;

                Animated.spring(translateX, {
                    toValue: targetX,
                    useNativeDriver: true,
                }).start(() => {
                    offsetRef.current = targetX;
                });

                deleteVisibleRef.current = shouldOpen;
                setShowDeleteButton(shouldOpen);
            },
        }),
    ).current;

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
        Animated.timing(translateX, {
            toValue: -400,
            duration: 200,
            useNativeDriver: true,
        }).start(({ finished }) => {
            if (finished) {
                removeTranslation(translation.id);
            }
        });
    };

    return (
        <View style={styles.swipeContainer}>
            <View style={styles.deleteBackground}>
                <IconButton
                    icon="close"
                    onPress={handleRemoveTranslation}
                    containerColor={theme.colors.error}
                    iconColor={theme.colors.onError}
                    size={24}
                    style={{ opacity: showDeleteButton ? 1 : 0 }}
                    accessibilityLabel={text("translation_clear_translation_accessibility")}
                />
            </View>
            <Animated.View
                style={{
                    transform: [{ translateX }],
                }}
                {...panResponder.panHandlers}
            >
                <Card style={[styles.historyCard, { backgroundColor: theme.colors.surfaceVariant }, getCardShadow(theme)]}>
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
            </Animated.View>
        </View>
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
    swipeContainer: {
        marginBottom: 16,
        position: "relative",
    },
    deleteBackground: {
        ...StyleSheet.absoluteFillObject,
        alignItems: "flex-end",
        justifyContent: "center",
        paddingRight: 12,
    },
});