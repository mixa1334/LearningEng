import { useAutoScroll } from "@/src/components/common/AutoScrollContext";
import { useHaptics } from "@/src/components/common/HapticsProvider";
import { usePractice } from "@/src/hooks/usePractice";
import { shuffleArray } from "@/src/util/shuffleArray";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, Layout, ZoomIn } from "react-native-reanimated";

import { useSoundPlayer } from "@/src/components/common/SoundProvider";
import { useLanguageContext } from "../../../common/LanguageProvider";
import { useAppTheme } from "../../../common/ThemeProvider";
import { PracticeModeChildProps } from "../PracticeModeWrapper";

type LetterTile = {
  id: number;
  char: string;
};

const HIGHLIGHT_DELAY = 500;

function buildLetterPool(word: string): LetterTile[] {
  const chars = word.split("");
  const tiles: LetterTile[] = chars.map((char, index) => ({
    id: index,
    char,
  }));
  return shuffleArray(tiles);
}

export default function BuildingFromCharsMode(props: Readonly<PracticeModeChildProps>) {
  const theme = useAppTheme();
  const { triggerScroll } = useAutoScroll();
  const { words } = usePractice();
  const { text } = useLanguageContext();
  const { successNotification, errorNotification } = useHaptics();
  const { playAccepted, playRejected } = useSoundPlayer();
  const [hasFinished, setHasFinished] = useState(words.length === 0);

  const [withoutMistakesCount, setWithoutMistakesCount] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [madeMistakeOnWord, setMadeMistakeOnWord] = useState(false);

  const [word, setWord] = useState(words[currentWordIndex]?.word_en.toUpperCase() || "");
  const [letterPool, setLetterPool] = useState<LetterTile[]>(() => words[currentWordIndex] ? buildLetterPool(words[currentWordIndex].word_en.toUpperCase()) : []);
  const [usedLetters, setUsedLetters] = useState<LetterTile[]>([]);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [incorrectLetterId, setIncorrectLetterId] = useState<number | null>(null);
  const [isWordHighlighted, setIsWordHighlighted] = useState(false);

  useEffect(() => {
     if(words[currentWordIndex]) {
         const w = words[currentWordIndex].word_en.toUpperCase();
         setWord(w);
         setLetterPool(buildLetterPool(w));
     }
  }, [currentWordIndex, words]);

  const moveToNextWord = () => {
    const newWithoutMistakesCount = withoutMistakesCount + (madeMistakeOnWord ? 0 : 1);
    setWithoutMistakesCount(newWithoutMistakesCount);
    setUsedLetters([]);
    setIsWordHighlighted(false);
    setIncorrectLetterId(null);
    setMadeMistakeOnWord(false);
    setCurrentLetterIndex(0);

    const nextWordIndex = currentWordIndex + 1;
    if (nextWordIndex >= words.length) {
      setHasFinished(true);
      props.onEndCurrentSet?.(
        text("practice_builder_end_message", {
          correct: newWithoutMistakesCount,
          total: words.length,
        })
      );
      return;
    }
    setCurrentWordIndex(nextWordIndex);
    triggerScroll();
  };

  const handleIncorrectPick = (id: number) => {
    playRejected();
    setMadeMistakeOnWord(true);
    setIncorrectLetterId(id);
    errorNotification();
    const timeout = setTimeout(() => {
      setIncorrectLetterId(null);
    }, HIGHLIGHT_DELAY);
    return () => clearTimeout(timeout);
  };

  const handleCorrectPick = (tile: LetterTile) => {
    setIncorrectLetterId(null);
    setUsedLetters(prev => [...prev, tile]);

    const newLetterIndex = currentLetterIndex + 1;
    setCurrentLetterIndex(newLetterIndex);
    if (newLetterIndex === word.length) {
      playAccepted();
      setIsWordHighlighted(true);
      successNotification();
      const timeout = setTimeout(() => {
        moveToNextWord();
      }, HIGHLIGHT_DELAY);
      return () => clearTimeout(timeout);
    }
  };

  const handleSelectLetter = (tile: LetterTile) => {
    if (isWordHighlighted) return;
    return tile.char === word[currentLetterIndex] ? handleCorrectPick(tile) : handleIncorrectPick(tile.id);
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
        </View>

        <View style={styles.letterBoxesRow}>
            {[...word].map((char, index) => {
              const isFilled = index < currentLetterIndex;
              return (
                <View
                  key={`box-${index}`}
                  style={[
                    styles.letterBox,
                    {
                      borderColor: theme.colors.outline,
                      backgroundColor: theme.colors.surface,
                    },
                    isFilled && {
                      backgroundColor: theme.colors.primaryContainer,
                      borderColor: theme.colors.primary,
                    },
                    isWordHighlighted && {
                      backgroundColor: theme.colors.accept,
                      borderColor: theme.colors.accept,
                    },
                  ]}
                >
                  {isFilled && (
                      <Animated.Text
                        entering={ZoomIn.springify()}
                        style={[
                            styles.letterBoxText,
                            { color: theme.colors.onPrimaryContainer },
                            isWordHighlighted && { color: theme.colors.onAcceptReject },
                        ]}
                      >
                        {char}
                      </Animated.Text>
                  )}
                </View>
              );
            })}
        </View>

        <View style={styles.letterPool}>
            {letterPool.map((tile, index) => {
              const isUsed = usedLetters.includes(tile);
              const isIncorrect = incorrectLetterId === tile.id;

              if (isUsed) {
                  return <View key={tile.id} style={styles.letterTilePlaceholder} />;
              }

              return (
                <Animated.View 
                    key={tile.id}
                    entering={FadeInDown.delay(index * 50).springify()}
                    layout={Layout.springify()}
                >
                    <TouchableOpacity
                    style={[
                        styles.letterTile,
                        {
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.outline,
                        },
                        isIncorrect && {
                        backgroundColor: theme.colors.reject,
                        borderColor: theme.colors.reject,
                        },
                    ]}
                    onPress={() => handleSelectLetter(tile)}
                    >
                    <Text
                        style={[
                        styles.letterTileText,
                        { color: theme.colors.onSurface },
                        isIncorrect && { color: theme.colors.onAcceptReject },
                        ]}
                    >
                        {tile.char}
                    </Text>
                    </TouchableOpacity>
                </Animated.View>
              );
            })}
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
      alignItems: 'center',
      marginBottom: 32,
  },
  wordHeaderLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  wordHeaderValue: {
    fontSize: 32,
    fontWeight: "800",
    textAlign: 'center',
  },
  letterBoxesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 40,
    gap: 8,
  },
  letterBox: {
    width: 40,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  letterBoxText: {
    fontSize: 24,
    fontWeight: "700",
  },
  letterPool: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    marginVertical: 8,
  },
  letterTile: {
    minWidth: 48,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  letterTilePlaceholder: {
      width: 48,
      height: 56,
  },
  letterTileText: {
    fontSize: 22,
    fontWeight: "700",
  },
});
