import { useAutoScroll } from "@/src/components/common/AutoScrollContext";
import { useHaptics } from "@/src/components/common/HapticsProvider";
import HiddenValue from "@/src/components/common/HiddenValue";
import { useLanguageContext } from "@/src/components/common/LanguageProvider";
import { useSoundPlayer } from "@/src/components/common/SoundProvider";
import { useAppTheme } from "@/src/components/common/ThemeProvider";
import { Word } from "@/src/entity/types";
import { usePractice } from "@/src/hooks/usePractice";
import { shuffleArray } from "@/src/util/shuffleArray";
import { MaterialIcons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import LottieView from "lottie-react-native";
import { useState, useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming, ZoomIn } from "react-native-reanimated";
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
    const { successNotification, errorNotification, lightImpact } = useHaptics();
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

    // Reset options when word changes
    useEffect(() => {
        if (!words[currentWordIndex]) return;
        setOptions(buildOptions(words, words[currentWordIndex]));
    }, [currentWordIndex, words]);

    const playAudio = (i: number) => {
        if (isPlaying) {
            Speech.stop();
        }
        setIsPlaying(true);
        Speech.speak(words[i].word_en, {
            language: "en",
            pitch: 1,
            rate: 0.8,
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
        setSelectedOptionId(null);

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
        playAudio(newWordIndex);
        triggerScroll();
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

    const handlePlayAudio = () => {
        lightImpact();
        playAudio(currentWordIndex);
    };

    const renderOption = (option: Word, index: number) => {
        const isSelected = selectedOptionId === option.id;
        const isRightOption = option.id === words[currentWordIndex].id;
        const isSuccess = isCorrect && isRightOption;
        const isError = isIncorrect && isSelected;

        return (
            <Animated.View 
                key={`${option.id}-${currentWordIndex}`}
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
                        {option.word_ru}
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
                    <HiddenValue value={words[currentWordIndex].word_en} />
                    
                    <View style={styles.audioButtonContainer}>
                        {isPlaying ? (
                            <LottieView
                                source={require("@/assets/animations/playing.json")}
                                autoPlay
                                loop={true}
                                speed={1.5}
                                resizeMode="contain"
                                style={styles.playAnimation}
                            />
                        ) : (
                            <Animated.View entering={ZoomIn.springify()}>
                                <Pressable
                                    onPress={handlePlayAudio}
                                    style={({ pressed }) => [
                                        styles.audioButton,
                                        {
                                            backgroundColor: theme.colors.primary,
                                            shadowColor: theme.colors.primary,
                                        },
                                        pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] },
                                    ]}
                                >
                                    <MaterialIcons name="play-arrow" size={48} color={theme.colors.onPrimary} />
                                </Pressable>
                            </Animated.View>
                        )}
                    </View>
                    <Text style={[styles.instructionText, { color: theme.colors.onSurfaceVariant }]}>
                        {text("practice_audio_play_button") || "Tap to listen"}
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
    },
    sessionContent: {
        flex: 1,
        justifyContent: 'center',
    },
    headerContainer: {
        alignItems: "center",
        marginBottom: 40,
    },
    audioButtonContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 24,
        height: 100,
        width: 100,
    },
    audioButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: "center",
        justifyContent: "center",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    instructionText: {
        fontSize: 16,
        fontWeight: "600",
        opacity: 0.7,
    },
    playAnimation: {
        width: 120,
        height: 120,
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
    },
    optionText: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
    },
});
