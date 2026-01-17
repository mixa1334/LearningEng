import { useAutoScroll } from "@/src/components/common/AutoScrollContext";
import { usePractice } from "@/src/hooks/usePractice";
import { shuffleArray } from "@/src/util/arrayHelper";
import * as Haptics from "expo-haptics";
import React, { useMemo, useState } from "react";
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
    id: index + 1,
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

  const [currentIndex, setCurrentIndex] = useState(0);

  const [madeMistakeOnWord, setMadeMistakeOnWord] = useState(false);

  const initialWord = words[0]?.word_en?.toUpperCase()?.trim?.() ?? "";
  const [letterPool, setLetterPool] = useState<LetterTile[]>(initialWord ? buildLetterPool(initialWord) : []);
  const [usedLetterIds, setUsedLetterIds] = useState<number[]>([]);
  const [incorrectLetterId, setIncorrectLetterId] = useState<number | null>(null);
  const [isWordHighlighted, setIsWordHighlighted] = useState(false);

  const moveToNextWord = () => {
    const newWithoutMistakesCount = withoutMistakesCount + (madeMistakeOnWord ? 0 : 1);
    setWithoutMistakesCount(newWithoutMistakesCount);
    setIsWordHighlighted(false);
    setIncorrectLetterId(null);
    setUsedLetterIds([]);
    setMadeMistakeOnWord(false);

    const nextIndex = currentIndex + 1;
    if (nextIndex >= words.length) {
      setHasFinished(true);
      props.onEndCurrentSet?.(
        text("practice_builder_end_message", {
          correct: newWithoutMistakesCount,
          total: words.length,
        })
      );
      return;
    }
    const nextWord = words[nextIndex];
    setLetterPool(buildLetterPool(nextWord.word_en.toUpperCase().trim()));
    setCurrentIndex(nextIndex);
    triggerScroll();
  };

  const handleSelectLetter = (tile: LetterTile) => {
    if (isWordHighlighted) return;
    if (usedLetterIds.includes(tile.id)) return;

    const pickedCount = usedLetterIds.length;
    const expectedChar = words[currentIndex].word_en[pickedCount];

    if (!expectedChar) {
      return;
    }

    const pickedChar = tile.char;

    if (pickedChar.toLowerCase() === expectedChar.toLowerCase()) {
      const newUsed = [...usedLetterIds, tile.id];
      setUsedLetterIds(newUsed);
      setIncorrectLetterId(null);

      if (newUsed.length === words[currentIndex].word_en.length) {
        setIsWordHighlighted(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        const timeout = setTimeout(() => {
          moveToNextWord();
        }, HIGHLIGHT_DELAY);
        return () => clearTimeout(timeout);
      }

      return;
    }

    setMadeMistakeOnWord(true);
    setIncorrectLetterId(tile.id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    const timeout = setTimeout(() => {
      setIncorrectLetterId(null);
    }, HIGHLIGHT_DELAY);
    return () => clearTimeout(timeout);
  };

  const selectedLetters = useMemo(() => {
    const usedSet = new Set(usedLetterIds);
    const orderedTiles = letterPool.filter((tile) => usedSet.has(tile.id)).sort((a, b) => a.id - b.id);
    return orderedTiles;
  }, [letterPool, usedLetterIds]);

  if (hasFinished || words.length === 0) return null;

  const length = words[currentIndex].word_en.length;

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
            <Text style={[styles.wordHeaderValue, { color: theme.colors.onSurfaceVariant }]}>{words[currentIndex].word_ru}</Text>
          </View>

          <View style={styles.letterBoxesRow}>
            {Array.from({ length }).map((_, index) => {
              const filledTile = selectedLetters[index];
              const isFilled = !!filledTile;

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
                    {filledTile ? filledTile.char : ""}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={styles.letterPool}>
            {letterPool.map((tile) => {
              const isUsed = usedLetterIds.includes(tile.id);
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
