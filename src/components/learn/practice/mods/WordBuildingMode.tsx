import { usePractice } from "@/src/hooks/usePractice";
import React, { useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "../../../common/ThemeProvider";
import { PracticeModeChildProps } from "../PracticeModeWrapper";

type LetterTile = {
  id: number;
  char: string;
};

const HIGHLIGHT_DELAY = 500;

function shuffleArray<T>(items: readonly T[]): T[] {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function buildLetterPool(word: string): LetterTile[] {
  const chars = word.split("");
  const tiles: LetterTile[] = chars.map((char, index) => ({
    id: index + 1,
    char,
  }));
  return shuffleArray(tiles);
}

export default function WordBuildingMode(props: PracticeModeChildProps) {
  const theme = useAppTheme();
  const { words } = usePractice();

  const [withoutMistakesCount, setWithoutMistakesCount] = useState(0);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [madeMistakeOnWord, setMadeMistakeOnWord] = useState(false);

  const [letterPool, setLetterPool] = useState<LetterTile[]>(buildLetterPool(words[0].word_en.trim()));
  const [usedLetterIds, setUsedLetterIds] = useState<number[]>([]);
  const [incorrectLetterId, setIncorrectLetterId] = useState<number | null>(null);
  const [isWordHighlighted, setIsWordHighlighted] = useState(false);

  const moveToNextWord = () => {
    setWithoutMistakesCount((prev) => prev + (madeMistakeOnWord ? 0 : 1));
    setIsWordHighlighted(false);
    setIncorrectLetterId(null);
    setUsedLetterIds([]);
    setMadeMistakeOnWord(false);

    const nextIndex = currentIndex + 1;
    if (nextIndex >= words.length) {
      props.onEndCurrentSet?.(`You solved ${withoutMistakesCount} / ${words.length} words without mistakes`);
      return;
    }
    const nextWord = words[nextIndex];
    setLetterPool(buildLetterPool(nextWord.word_en.trim()));
    setCurrentIndex(nextIndex);
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
        const timeout = setTimeout(() => {
          moveToNextWord();
        }, HIGHLIGHT_DELAY);
        return () => clearTimeout(timeout);
      }

      return;
    }

    setMadeMistakeOnWord(true);
    setIncorrectLetterId(tile.id);
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

  const wordsLeft = words.length - currentIndex - (isWordHighlighted ? 0 : 1);

  const renderLetterBoxes = () => {
    const length = words[currentIndex].word_en.length;

    return (
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
                  backgroundColor: theme.colors.surfaceVariant,
                },
                isFilled && {
                  backgroundColor: theme.colors.primaryContainer,
                  borderColor: theme.colors.primary,
                },
                isWordHighlighted && {
                  backgroundColor: "#4CAF50",
                  borderColor: theme.colors.primary,
                },
              ]}
            >
              <Text style={[styles.letterBoxText, { color: theme.colors.onSurface }]}>{filledTile ? filledTile.char : ""}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  const renderLetterPool = () => {
    return (
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
                  backgroundColor: theme.colors.surfaceVariant,
                  borderColor: theme.colors.outline,
                },
                isUsed && {
                  opacity: 0.2,
                },
                isIncorrect && {
                  backgroundColor: theme.colors.error,
                  borderColor: theme.colors.error,
                },
              ]}
              disabled={isUsed}
              onPress={() => handleSelectLetter(tile)}
            >
              <Text style={[styles.letterTileText, { color: theme.colors.onSurfaceVariant }]}>{tile.char}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderContent = () => {
    return (
      <View style={styles.sessionContent}>
        <View style={[styles.modeCard, { backgroundColor: theme.colors.primary }]}>
          <View style={[styles.wordHeader, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Text style={[styles.wordHeaderLabel, { color: theme.colors.onSurface }]}>Russian word</Text>
            <Text style={[styles.wordHeaderValue, { color: theme.colors.onSurface }]}>{words[currentIndex].word_ru}</Text>
          </View>

          {renderLetterBoxes()}

          {renderLetterPool()}
        </View>
      </View>
    );
  };

  return <View style={styles.container}>{renderContent()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 16,
  },
  topRowLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 24,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 12,
  },
  sessionContent: {
    flex: 1,
  },
  modeCard: {
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 20,
    alignSelf: "center",
    marginVertical: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    width: "100%",
  },
  progressCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  wordHeader: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  wordHeaderLabel: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 4,
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
    marginTop: 8,
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
  progressRow: {
    marginTop: 16,
    alignItems: "center",
  },
  progressText: {
    fontSize: 14,
    fontWeight: "500",
  },
  endBtn: {
    borderRadius: 8,
  },
});
