import { useAutoScroll } from "@/src/components/common/AutoScrollContext";
import { getCardShadow } from "@/src/components/common/cardShadow";
import HiddenValue from "@/src/components/common/HiddenValue";
import { useLanguageContext } from "@/src/components/common/LanguageProvider";
import { useSoundPlayer } from "@/src/components/common/SoundProvider";
import { useAppTheme } from "@/src/components/common/ThemeProvider";
import { Word } from "@/src/entity/types";
import { usePractice } from "@/src/hooks/usePractice";
import { shuffleArray } from "@/src/util/arrayHelper";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";
import LottieView from "lottie-react-native";
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

export default function AudioMode(props: Readonly<PracticeModeChildProps>) {
    const theme = useAppTheme();
    const { words } = usePractice();
    const { text } = useLanguageContext();
    const { triggerScroll } = useAutoScroll();
    const { playAccepted, playRejected } = useSoundPlayer();
    const [hasFinished, setHasFinished] = useState(words.length === 0);

    const [madeMistake, setMadeMistake] = useState(false);
    const [mistakesCount, setMistakesCount] = useState(0);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [options, setOptions] = useState(buildOptions(words, words[currentWordIndex]));
    const [isCorrect, setIsCorrect] = useState(false);
    const [isIncorrect, setIsIncorrect] = useState(false);
    const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const playAudio = (i: number) => {
        if (isPlaying) {
            Speech.stop();
        }
        setIsPlaying(true);
        Speech.speak(words[i].word_en, {
            language: "en",
            pitch: 1,
            rate: 0.3,
            onDone: () => { setTimeout(() => setIsPlaying(false), 300); },
            onStopped: () => setIsPlaying(false),
            onError: () => setIsPlaying(false),
        });
    };

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
                text("practice_audio_end_message", {
                    mistakes: mistakes,
                })
            );
            return;
        }
        setCurrentWordIndex(newWordIndex);
        setOptions(buildOptions(words, words[newWordIndex]));
        playAudio(newWordIndex);
        triggerScroll();
    }

    const handleCorrectPick = () => {
        playAccepted();
        setIsCorrect(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        const timeout = setTimeout(() => {
            moveToNextWord();
        }, HIGHLIGHT_DELAY);
        return () => clearTimeout(timeout);
    };

    const handleIncorrectPick = () => {
        playRejected();
        setMadeMistake(true);
        setIsIncorrect(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
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

    const handlePlayAudio = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        playAudio(currentWordIndex);
    };

    if (hasFinished || words.length === 0) return null;

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
                    {option.word_ru}
                </Text>
            </Pressable>
        );
    };

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
                    <HiddenValue value={words[currentWordIndex].word_en} />
                    <View style={styles.audioButtonContainer}>

                        {isPlaying ? (
                            <LottieView
                                source={require("@/assets/animations/playing.json")}
                                autoPlay
                                loop={true}
                                speed={2}
                                resizeMode="contain"
                                style={styles.playAnimation}
                            />
                        ) : (
                            <Pressable
                                onPress={handlePlayAudio}
                                style={({ pressed }) => [
                                    styles.audioButton,
                                    {
                                        backgroundColor: theme.colors.primary,
                                        borderColor: theme.colors.onPrimary,
                                    },
                                    pressed && {
                                        opacity: 0.5,
                                    },
                                ]}
                            >
                                <MaterialIcons name="play-arrow" size={24} color={theme.colors.onPrimary} />
                                <Text style={[styles.audioButtonText, { color: theme.colors.onPrimary }]}>
                                    {text("practice_audio_play_button")}
                                </Text>
                            </Pressable>
                        )}
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
    audioButtonContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 25,
        height: 50,
    },
    audioButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 999,
        borderWidth: 2,
        paddingVertical: 10,
        paddingHorizontal: 26,
        gap: 10,
    },
    audioButtonIcon: {
        fontSize: 24,
        fontWeight: "800",
    },
    audioButtonText: {
        fontSize: 18,
        fontWeight: "700",
    },
    optionsContainer: {
        flex: 1,
        justifyContent: "center",
        gap: 10,
        paddingHorizontal: 30,
        paddingBottom: 10,
    },
    optionButton: {
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
    playAnimation: {
        alignSelf: "center",
        width: 100,
        height: 100,
    },
});