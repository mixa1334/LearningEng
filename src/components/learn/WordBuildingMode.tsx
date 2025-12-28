import { useVocabulary } from "@/src/hooks/useVocabulary";
import { Word } from "@/src/model/entity/types";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button, Switch, useTheme } from "react-native-paper";

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

export default function WordBuildingMode() {
  const theme = useTheme();
  const { userWords, preloadedWords } = useVocabulary();

  const [onlyUserAddedWords, setOnlyUserAddedWords] = useState(true);

  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const [sessionWords, setSessionWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [letterPool, setLetterPool] = useState<LetterTile[]>([]);
  const [usedLetterIds, setUsedLetterIds] = useState<number[]>([]);
  const [incorrectLetterId, setIncorrectLetterId] = useState<number | null>(
    null
  );
  const [isWordHighlighted, setIsWordHighlighted] = useState(false);

  const wordsPool = useMemo(
    () => (onlyUserAddedWords ? userWords : [...userWords, ...preloadedWords]),
    [onlyUserAddedWords, userWords, preloadedWords]
  );

  const currentWord: Word | undefined =
    sessionWords.length > 0 ? sessionWords[currentIndex] : undefined;

  const normalizedTarget = useMemo(() => {
    if (!currentWord) return "";
    return currentWord.word_en.trim();
  }, [currentWord]);

  const totalWords = wordsPool.length;

  const resetState = () => {
    setIsStarted(false);
    setIsCompleted(false);
    setSessionWords([]);
    setCurrentIndex(0);
    setLetterPool([]);
    setUsedLetterIds([]);
    setIncorrectLetterId(null);
    setIsWordHighlighted(false);
  };

  useEffect(() => {
    // when source words or filter changes, stop current session
    resetState();
     
  }, [wordsPool.length]);

  const buildLetterPool = (word: string): LetterTile[] => {
    const chars = word.split("");
    const tiles: LetterTile[] = chars.map((char, index) => ({
      id: index + 1,
      char,
    }));
    return shuffleArray(tiles);
  };

  const startSession = () => {
    if (wordsPool.length === 0) return;
    const shuffledWords = shuffleArray(wordsPool);
    setSessionWords(shuffledWords);
    setCurrentIndex(0);
    const firstWord = shuffledWords[0];
    setLetterPool(buildLetterPool(firstWord.word_en.trim()));
    setUsedLetterIds([]);
    setIncorrectLetterId(null);
    setIsWordHighlighted(false);
    setIsCompleted(false);
    setIsStarted(true);
  };

  const endSession = () => {
    setIsStarted(false);
    setIsCompleted(false);
    setSessionWords([]);
    setCurrentIndex(0);
    setLetterPool([]);
    setUsedLetterIds([]);
    setIncorrectLetterId(null);
    setIsWordHighlighted(false);
  };

  const moveToNextWord = () => {
    setIsWordHighlighted(false);
    setIncorrectLetterId(null);
    setUsedLetterIds([]);

    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (nextIndex >= sessionWords.length) {
        setIsStarted(false);
        setIsCompleted(false);
        setLetterPool([]);
        setUsedLetterIds([]);
        setIncorrectLetterId(null);
        setIsWordHighlighted(false);
        return prevIndex;
      }

      const nextWord = sessionWords[nextIndex];
      setLetterPool(buildLetterPool(nextWord.word_en.trim()));
      return nextIndex;
    });
  };

  const handleToggleOnlyUserAdded = () => {
    setOnlyUserAddedWords((prev) => !prev);
  };

  const handleSelectLetter = (tile: LetterTile) => {
    if (!isStarted || !currentWord || isWordHighlighted) return;
    if (usedLetterIds.includes(tile.id)) return;

    const pickedCount = usedLetterIds.length;
    const expectedChar = normalizedTarget[pickedCount];

    if (!expectedChar) {
      return;
    }

    const pickedChar = tile.char;

    if (pickedChar.toLowerCase() === expectedChar.toLowerCase()) {
      const newUsed = [...usedLetterIds, tile.id];
      setUsedLetterIds(newUsed);
      setIncorrectLetterId(null);

      if (newUsed.length === normalizedTarget.length) {
        setIsWordHighlighted(true);
        const timeout = setTimeout(() => {
          moveToNextWord();
        }, HIGHLIGHT_DELAY);
        return () => clearTimeout(timeout);
      }

      return;
    }

    setIncorrectLetterId(tile.id);
    const timeout = setTimeout(() => {
      setIncorrectLetterId(null);
    }, HIGHLIGHT_DELAY);
    return () => clearTimeout(timeout);
  };

  const selectedLetters = useMemo(() => {
    const usedSet = new Set(usedLetterIds);
    const orderedTiles = letterPool
      .filter((tile) => usedSet.has(tile.id))
      .sort((a, b) => a.id - b.id);
    return orderedTiles;
  }, [letterPool, usedLetterIds]);

  const wordsLeft =
    isStarted && sessionWords.length > 0
      ? sessionWords.length - currentIndex - (isWordHighlighted ? 0 : 1)
      : 0;

  const hasWords = totalWords > 0;

  const renderLetterBoxes = () => {
    if (!currentWord) return null;

    const length = normalizedTarget.length;

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
              <Text
                style={[
                  styles.letterBoxText,
                  { color: theme.colors.onSurface },
                ]}
              >
                {filledTile ? filledTile.char : ""}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  const renderLetterPool = () => {
    if (!currentWord) return null;

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
              disabled={isUsed || !isStarted}
              onPress={() => handleSelectLetter(tile)}
            >
              <Text
                style={[
                  styles.letterTileText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {tile.char}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderContent = () => {
    if (!hasWords) {
      return (
        <View style={styles.centered}>
          <Text
            style={[styles.infoText, { color: theme.colors.onPrimary }]}
          >
            No words available for training. Try adding some words to your
            vocabulary.
          </Text>
        </View>
      );
    }

    if (!isStarted && !isCompleted) {
      return (
        <View style={styles.centered}>
          <Text
            style={[styles.infoText, { color: theme.colors.onPrimary }]}
          >
            Build the English word by picking letters in the correct order.
          </Text>
          <Text
            style={[
              styles.infoTextSecondary,
              { color: theme.colors.onPrimary },
            ]}
          >
            You will see the Russian word on top and a shuffled pool of
            letters below. Tap letters to form the correct English word.
          </Text>
          <Button
            mode="contained-tonal"
            onPress={startSession}
            style={styles.controlButton}
            icon="play"
          >
            Start
          </Button>
        </View>
      );
    }

    if (!currentWord) {
      return null;
    }

    return (
      <View style={styles.sessionContent}>
        <View
          style={[
            styles.wordHeader,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
        >
          <Text style={[styles.wordHeaderLabel, { color: theme.colors.onSurface }]}>
            Russian word
          </Text>
          <Text
            style={[styles.wordHeaderValue, { color: theme.colors.onSurface }]}
          >
            {currentWord.word_ru}
          </Text>
        </View>

        {renderLetterBoxes()}

        {renderLetterPool()}

        <View style={styles.progressRow}>
          <Text
            style={[
              styles.progressText,
              { color: theme.colors.onPrimary },
            ]}
          >
            Words left: {wordsLeft >= 0 ? wordsLeft : 0} / {sessionWords.length}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.topRow,
          { backgroundColor: theme.colors.surfaceVariant },
        ]}
      >
        <Text
          style={[styles.topRowLabel, { color: theme.colors.onSurface }]}
        >
          Only user added words
        </Text>
        <Switch
          value={onlyUserAddedWords}
          onValueChange={handleToggleOnlyUserAdded}
        />
      </View>

      {renderContent()}

      {isStarted && (
        <Button
          mode="contained-tonal"
          onPress={endSession}
          style={[
            styles.bottomButton,
            { backgroundColor: theme.colors.errorContainer },
          ]}
          icon="flag-checkered"
        >
          End training
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  infoTextSecondary: {
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
    marginBottom: 16,
  },
  sessionContent: {
    flex: 1,
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
  controlButton: {
    marginTop: 16,
    borderRadius: 8,
    alignSelf: "center",
    paddingHorizontal: 24,
  },
  bottomButton: {
    marginTop: 16,
    borderRadius: 8,
    alignSelf: "center",
    paddingHorizontal: 24,
  },
});


