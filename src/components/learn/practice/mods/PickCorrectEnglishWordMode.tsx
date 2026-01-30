import { useHaptics } from "@/src/components/common/HapticsProvider";
import { useLanguageContext } from "@/src/components/common/LanguageProvider";
import { useSoundPlayer } from "@/src/components/common/SoundProvider";
import { useAppTheme } from "@/src/components/common/ThemeProvider";
import { Word } from "@/src/entity/types";
import { usePractice } from "@/src/hooks/usePractice";
import { shuffleArray } from "@/src/util/shuffleArray";
import { useState, useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, ZoomIn, useAnimatedStyle, useSharedValue, withSequence, withTiming, withRepeat } from "react-native-reanimated";
import { PracticeModeChildProps } from "../PracticeModeWrapper";

const HIGHLIGHT_DELAY = 600;
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

    // Reset options when word changes
    useEffect(() => {
        if (!words[currentWordIndex]) return;
        setOptions(buildOptions(words, words[currentWordIndex]));
    }, [currentWordIndex, words]);

    const moveToNextWord = () => {
        const mistakes = madeMistake ? mistakesCount + 1 : mistakesCount;
        setMadeMistake(false);
        setMistakesCount(mistakes);
        setIsCorrect(false);
        setIsIncorrect(false);
        setSelectedOptionId(null);
        
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

    const renderOption = (option: Word, index: number) => {
        const isSelected = selectedOptionId === option.id;
        const isRightOption = option.id === words[currentWordIndex].id;
        const isSuccess = isCorrect && isRightOption;
        const isError = isIncorrect && isSelected;

        return (
            <Animated.View 
                key={`${option.id}-${currentWordIndex}`} // Force re-render animation on new word
                entering={FadeInDown.delay(index * 100).springify()}
                style={{ width: '100%' }}
            >
                <Pressable
                    onPress={() => handleSelectOption(option)}
                    disabled={isCorrect || isIncorrect}
                    style={({ pressed }) => [
                        styles.optionButton,
                        {
                            backgroundColor: theme.colors.surface,
                            borderColor: theme.colors.outline,
                        },
                        pressed && !isCorrect && !isIncorrect && {
                            backgroundColor: theme.colors.surfaceVariant,
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
                            { color: theme.colors.onSurface },
                            (isSuccess || isError) && { color: theme.colors.onAcceptReject },
                        ]}
                    >
                        {option.word_en}
                    </Text>
                </Pressable>
            </Animated.View>
        );
    };

    if (hasFinished || words.length === 0) return null;

    return (
        <View style={styles.container}>
            <View style={styles.sessionContent}>
                <View style={styles.headerContainer}>
                     <Animated.Text 
                        key={`q-${words[currentWordIndex].id}`}
                        entering={ZoomIn.springify()}
                        style={[styles.wordHeaderValue, { color: theme.colors.primary }]}
                    >
                        {words[currentWordIndex].word_ru}
                    </Animated.Text>
                    <Text style={[styles.instructionText, { color: theme.colors.onSurfaceVariant }]}>
                        {text("practice_pick_english_instruction") || "Select the correct translation"}
                    </Text>
                </View>

                <View style={styles.optionsContainer}>
                    {options.map((opt, idx) => renderOption(opt, idx))}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    sessionContent: {
        flex: 1,
        justifyContent: 'center',
    },
    headerContainer: {
        marginBottom: 40,
        alignItems: 'center',
    },
    wordHeaderValue: {
        fontSize: 36,
        fontWeight: "800",
        textAlign: "center",
        marginBottom: 8,
    },
    instructionText: {
        fontSize: 16,
        opacity: 0.7,
        textAlign: "center",
    },
    optionsContainer: {
        width: '100%',
        gap: 12,
    },
    optionButton: {
        width: '100%',
        borderRadius: 16,
        borderWidth: 1,
        paddingVertical: 18,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    optionText: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
    },
});
