import { useAutoScroll } from "@/src/components/common/AutoScrollContext";
import { usePractice } from "@/src/hooks/usePractice";
import { shuffleArray } from "@/src/util/arrayHelper";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useLanguageContext } from "../../../common/LanguageProvider";
import { useAppTheme } from "../../../common/ThemeProvider";
import { getCardShadow } from "../../../common/cardShadow";
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

export default function BuildingFromCharsMode(props: PracticeModeChildProps) {
  const theme = useAppTheme();
  const { triggerScroll } = useAutoScroll();
  const { words } = usePractice();
  const { text } = useLanguageContext();

  const [hasFinished, setHasFinished] = useState(words.length === 0);

  const [withoutMistakesCount, setWithoutMistakesCount] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [madeMistakeOnWord, setMadeMistakeOnWord] = useState(false);

  const [word, setWord] = useState(words[currentWordIndex].word_en.toUpperCase());
  const [letterPool, setLetterPool] = useState<LetterTile[]>(buildLetterPool(word));
  const [usedLetters, setUsedLetters] = useState<LetterTile[]>([]);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [incorrectLetterId, setIncorrectLetterId] = useState<number | null>(null);
  const [isWordHighlighted, setIsWordHighlighted] = useState(false);

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
    const nextWord = words[nextWordIndex].word_en.toUpperCase();
    setWord(nextWord);
    setLetterPool(buildLetterPool(nextWord));
    setCurrentWordIndex(nextWordIndex);
    triggerScroll();
  };

  const handleIncorrectPick = (id: number) => {
    setMadeMistakeOnWord(true);
    setIncorrectLetterId(id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
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
      setIsWordHighlighted(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
        <View
          style={[
            styles.modeCard,
            { backgroundColor: theme.colors.surfaceVariant },
            getCardShadow(theme),
          ]}
        >
          <View style={styles.wordHeader}>
            <Text style={[styles.wordHeaderLabel, { color: theme.colors.onSurfaceVariant }]}>
              {text("practice_builder_ru_label")}
            </Text>
            <Text style={[styles.wordHeaderValue, { color: theme.colors.onSurfaceVariant }]}>{words[currentWordIndex].word_ru}</Text>
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
                      backgroundColor: theme.colors.onSurfaceVariant,
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
                  <Text
                    style={[
                      styles.letterBoxText,
                      { color: theme.colors.surface },
                      isWordHighlighted && { color: theme.colors.onAcceptReject },
                      isFilled && { color: theme.colors.onPrimaryContainer },
                    ]}
                  >
                    {isFilled ? char : ""}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={styles.letterPool}>
            {letterPool.map((tile) => {
              const isUsed = usedLetters.includes(tile);
              const isIncorrect = incorrectLetterId === tile.id;

              return (
                <TouchableOpacity
                  key={tile.id}
                  style={[
                    styles.letterTile,
                    {
                      backgroundColor: theme.colors.onSurfaceVariant,
                      borderColor: theme.colors.outline,
                    },
                    isUsed && {
                      opacity: 0.3,
                    },
                    isIncorrect && {
                      backgroundColor: theme.colors.reject,
                      borderColor: theme.colors.reject,
                    },
                  ]}
                  disabled={isUsed}
                  onPress={() => handleSelectLetter(tile)}
                >
                  <Text
                    style={[
                      styles.letterTileText,
                      { color: theme.colors.surface },
                      isIncorrect && { color: theme.colors.onAcceptReject },
                    ]}
                  >
                    {tile.char}
                  </Text>
                </TouchableOpacity>
              );
            })}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  wordHeaderLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  wordHeaderValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  letterBoxesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 16,
    gap: 8,
  },
  letterBox: {
    width: 32,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  letterBoxText: {
    fontSize: 20,
    fontWeight: "700",
  },
  letterPool: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginVertical: 8,
  },
  letterTile: {
    minWidth: 40,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  letterTileText: {
    fontSize: 18,
    fontWeight: "700",
  },
});
