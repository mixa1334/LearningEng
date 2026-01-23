import { getCardShadow } from "@/src/components/common/cardShadow";
import { useLanguageContext } from "@/src/components/common/LanguageProvider";
import { useHaptics } from "@/src/components/common/HapticsProvider";
import { useSoundPlayer } from "@/src/components/common/SoundProvider";
import { useAppTheme } from "@/src/components/common/ThemeProvider";
import { Word } from "@/src/entity/types";
import { usePractice } from "@/src/hooks/usePractice";
import { shuffleArray } from "@/src/util/arrayHelper";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { PracticeModeChildProps } from "../PracticeModeWrapper";

const HIGHLIGHT_DELAY = 500;

const OPTIONS_COUNT = 3;

const buildOptions = (words: Word[], currentWord: Word) => {
    const shuffled = shuffleArray(words.filter(w => w.id !== currentWord.id));
    const index = Math.floor(Math.random() * OPTIONS_COUNT);
    return [
        ...shuffled.slice(0, index),
        currentWord,
        ...shuffled.slice(index, OPTIONS_COUNT)
    ];
};

export default function PickCorrectEnglishWordMode(
    props: Readonly<PracticeModeChildProps>
) {
    const theme = useAppTheme();
    const { words } = usePractice();
    const { text } = useLanguageContext();
    const { successNotification, errorNotification } = useHaptics();
    const { playAccepted, playRejected } = useSoundPlayer();
    const [hasFinished, setHasFinished] = useState(words.length === 0);

    const [madeMistake, setMadeMistake] = useState(false);
    const [mistakesCount, setMistakesCount] = useState(0);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [options, setOptions] = useState(buildOptions(words, words[currentWordIndex]));
    const [isCorrect, setIsCorrect] = useState(false);
    const [isIncorrect, setIsIncorrect] = useState(false);
    const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);

    const moveToNextWord = () => {
        const mistakes = madeMistake ? mistakesCount + 1 : mistakesCount;
        setMadeMistake(false);
        setMistakesCount(mistakes);
        setIsCorrect(false);
        setIsIncorrect(false);
        const newWordIndex = currentWordIndex + 1;
        if (newWordIndex >= words.length) {
            setHasFinished(true);
            props.onEndCurrentSet?.(
                text("practice_pick_english_end_message", {
                    mistakes: mistakes,
                })
            );
            return;
        }
        setCurrentWordIndex(newWordIndex);
        setOptions(buildOptions(words, words[newWordIndex]));
    }

    const handleCorrectPick = () => {
        playAccepted();
        setIsCorrect(true);
        successNotification();
        const timeout = setTimeout(() => {
            moveToNextWord();
        }, HIGHLIGHT_DELAY);
        return () => clearTimeout(timeout);
    };

    const handleIncorrectPick = () => {
        playRejected();
        setMadeMistake(true);
        setIsIncorrect(true);
        errorNotification();
        const timeout = setTimeout(() => {
            setIsIncorrect(false);
        }, HIGHLIGHT_DELAY);
        return () => clearTimeout(timeout);
    };

    const handleSelectOption = (word: Word) => {
        if (isCorrect || isIncorrect) return;

        setSelectedOptionId(word.id);
        return word.id === words[currentWordIndex].id ? handleCorrectPick() : handleIncorrectPick();
    };

    const renderOption = (option: Word) => {
        const isSelected = selectedOptionId === option.id;
        const isRightOption = option.id === words[currentWordIndex].id;
        const isSuccess = isCorrect && isRightOption;
        const isError = isIncorrect && isSelected;

        return (
            <Pressable
                key={option.id}
                onPress={() => handleSelectOption(option)}
                disabled={isCorrect || isIncorrect}
                style={({ pressed }) => [
                    styles.optionButton,
                    {
                        backgroundColor: theme.colors.onSurfaceVariant,
                        borderColor: theme.colors.outline,
                    },
                    pressed &&
                    !isCorrect &&
                    !isIncorrect && {
                        opacity: 0.85,
                        transform: [{ scale: 0.98 }],
                    },
                    isSuccess && {
                        backgroundColor: theme.colors.accept,
                        borderColor: theme.colors.accept,
                    },
                    isError && {
                        backgroundColor: theme.colors.reject,
                        borderColor: theme.colors.reject,
                    },
                ]}
            >
                <Text
                    style={[
                        styles.optionText,
                        { color: theme.colors.surface },
                        (isSuccess || isError) && { color: theme.colors.onAcceptReject },
                    ]}
                >
                    {option.word_en}
                </Text>
            </Pressable>
        );
    };

    if (hasFinished || words.length === 0) return null;

    return (
        <View style={styles.container}>
            <View style={styles.sessionContent}>
                <View
                    style={[
                        styles.modeCard,
                        { backgroundColor: theme.colors.surfaceVariant },
                        getCardShadow(theme),
                    ]}
                >
                    <View style={styles.wordHeader}>
                        <Text style={[styles.wordHeaderValue, { color: theme.colors.primary }]}>
                            {words[currentWordIndex].word_ru}
                        </Text>
                    </View>

                    <View style={styles.optionsContainer}>
                        {options.map(renderOption)}
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 2,
    },
    sessionContent: {
        flex: 1,
    },
    modeCard: {
        flex: 1,
        borderRadius: 20,
        marginVertical: 16,
        padding: 10,
    },
    wordHeader: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 12,
        marginBottom: 20,
    },
    wordHeaderValue: {
        fontSize: 28,
        fontWeight: "800",
        textAlign: "center",
    },
    optionsContainer: {
        flex: 1,
        justifyContent: "center",
        gap: 10,
        paddingHorizontal: 30,
    },
    optionButton: {
        flex: 1,
        borderRadius: 12,
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    optionText: {
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
});