import { Word } from "@/src/entity/types";
import { useVocabulary } from "@/src/hooks/useVocabulary";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button, Switch, useTheme } from "react-native-paper";

const VISIBLE_PAIRS = 4;

function shuffleArray<T>(items: readonly T[]): T[] {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

type IncorrectPair = {
  ruId: number;
  enId: number;
} | null;

type CorrectPair = {
  ruId: number;
  enId: number;
} | null;

export default function WordPairsMode() {
  const theme = useTheme();
  const { userWords, preloadedWords } = useVocabulary();

  const [onlyUserAddedWords, setOnlyUserAddedWords] = useState(true);
  const [isStarted, setIsStarted] = useState(false);

  const [sessionWords, setSessionWords] = useState<Word[]>([]);
  const [visibleIds, setVisibleIds] = useState<number[]>([]);
  const [solvedIds, setSolvedIds] = useState<number[]>([]);
  const [englishOrder, setEnglishOrder] = useState<number[]>([]);

  const [selectedRuId, setSelectedRuId] = useState<number | null>(null);
  const [selectedEnId, setSelectedEnId] = useState<number | null>(null);
  const [incorrectPair, setIncorrectPair] = useState<IncorrectPair>(null);
  const [correctPair, setCorrectPair] = useState<CorrectPair>(null);

  const wordsPool = useMemo(() => {
    return onlyUserAddedWords ? userWords : [...userWords, ...preloadedWords];
  }, [onlyUserAddedWords, userWords, preloadedWords]);

  const resetGame = () => {
    setIsStarted(false);
    setSessionWords([]);
    setVisibleIds([]);
    setSolvedIds([]);
    setEnglishOrder([]);
    setSelectedRuId(null);
    setSelectedEnId(null);
    setIncorrectPair(null);
  };

  useEffect(() => {
    resetGame();
  }, [wordsPool.length]);

  const startGame = () => {
    if (wordsPool.length < 2) {
      return;
    }

    const shuffled = shuffleArray(wordsPool);
    const maxVisible = Math.min(VISIBLE_PAIRS, shuffled.length);
    const visible = shuffled.slice(0, maxVisible).map((w) => w.id);

    setSessionWords(shuffled);
    setVisibleIds(visible);
    setSolvedIds([]);
    setEnglishOrder(shuffleArray(visible));
    setSelectedRuId(null);
    setSelectedEnId(null);
    setIncorrectPair(null);
    setIsStarted(true);
  };

  const stopGame = () => {
    resetGame();
  };

  const getWordById = (id: number) => {
    return sessionWords.find((w) => w.id === id);
  };

  const handleSelectRu = (id: number) => {
    if (!isStarted || incorrectPair || correctPair) return;
    setSelectedRuId((prev) => (prev === id ? null : id));
  };

  const handleSelectEn = (id: number) => {
    if (!isStarted || incorrectPair || correctPair) return;
    setSelectedEnId((prev) => (prev === id ? null : id));
  };

  const handleCorrectMatch = (matchedId: number) => {
    const newSolved = [...solvedIds, matchedId];
    const remainingVisibleRu = visibleIds.filter((id) => id !== matchedId);


    const usedIds = new Set<number>([...newSolved, ...remainingVisibleRu]);
    const remainingWords = sessionWords.filter((w) => !usedIds.has(w.id));
    const nextWord = remainingWords[0];


    let updatedVisible = [...remainingVisibleRu];
    if (nextWord) {
      updatedVisible.push(nextWord.id);
    }

    if (updatedVisible.length === 0) {
      setSolvedIds(newSolved);
      setVisibleIds([]);
      setEnglishOrder([]);
      setIsStarted(false);
      return;
    }

    const shuffledVisible = shuffleArray(updatedVisible);
    const shuffledEnglish = shuffleArray(updatedVisible);

    setSolvedIds(newSolved);
    setVisibleIds(shuffledVisible);
    setEnglishOrder(shuffledEnglish);
    setIncorrectPair(null);
  };

  useEffect(() => {
    if (!isStarted) return;
    if (selectedRuId === null || selectedEnId === null) {
      return;
    }

    if (selectedRuId === selectedEnId) {
      const ruId = selectedRuId;
      const enId = selectedEnId;
      setCorrectPair({ ruId, enId });
      const timeout = setTimeout(() => {
        handleCorrectMatch(ruId);
        setCorrectPair(null);
        setSelectedRuId(null);
        setSelectedEnId(null);
      }, 400);
      return () => clearTimeout(timeout);
    } else {
      const ruId = selectedRuId;
      const enId = selectedEnId;
      setIncorrectPair({ ruId, enId });
      const timeout = setTimeout(() => {
        setIncorrectPair(null);
        setSelectedRuId(null);
        setSelectedEnId(null);
      }, 500);
      return () => clearTimeout(timeout);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRuId, selectedEnId, isStarted]);

  const handleToggleOnlyUserAdded = () => {
    setOnlyUserAddedWords((prev) => !prev);
  };

  const hasEnoughWords = wordsPool.length >= 2;

  const renderContent = () => {
    if (!hasEnoughWords) {
      return (
        <View style={styles.centered}>
          <Text style={[styles.infoText, { color: theme.colors.onPrimary }]}>
            Not enough words to create pairs. Try adding more words to your
            vocabulary.
          </Text>
        </View>
      );
    }

    if (!isStarted && solvedIds.length > 0) {
      return (
        <View style={styles.centered}>
          <Text style={[styles.infoText, { color: theme.colors.onPrimary }]}>
            You matched all available pairs!
          </Text>
          <Button
            mode="contained-tonal"
            onPress={startGame}
            style={styles.controlButton}
            icon="restart"
          >
            Play again
          </Button>
        </View>
      );
    }

    if (!isStarted) {
      return (
        <View style={styles.centered}>
          <Text style={[styles.infoText, { color: theme.colors.onPrimary }]}>
            Match each Russian word with its English translation.
          </Text>
          <Button
            mode="contained-tonal"
            onPress={startGame}
            style={styles.controlButton}
            icon="play"
          >
            Start
          </Button>
        </View>
      );
    }

    return (
      <View style={styles.gameArea}>
        <View style={styles.columnsHeader}>
          <Text style={[styles.columnTitle, { color: theme.colors.onPrimary }]}>
            Russian
          </Text>
          <Text style={[styles.columnTitle, { color: theme.colors.onPrimary }]}>
            English
          </Text>
        </View>
        <View style={styles.rows}>
          {visibleIds.map((ruId, index) => {
            const enId = englishOrder[index];
            const ruWord = getWordById(ruId);
            const enWord = enId !== undefined ? getWordById(enId) : undefined;

            if (!ruWord && !enWord) {
              return null;
            }

            const ruSelected = selectedRuId === ruId;
            const ruIncorrect = incorrectPair?.ruId === ruId;
            const ruCorrect = correctPair?.ruId === ruId;
            const enSelected = enId !== undefined && selectedEnId === enId;
            const enIncorrect = enId !== undefined && incorrectPair?.enId === enId;
            const enCorrect = enId !== undefined && correctPair?.enId === enId;

            return (
              <View
                key={`row-${ruId}-${enId ?? "none"}`}
                style={styles.row}
              >
                <View style={styles.cell}>
                  {ruWord && (
                    <TouchableOpacity
                      style={[
                        styles.wordChip,
                        {
                          backgroundColor: theme.colors.surfaceVariant,
                          borderColor: theme.colors.outline,
                        },
                        ruSelected && {
                          borderColor: theme.colors.primaryContainer,
                          backgroundColor: theme.colors.outline,
                        },
                        ruIncorrect && {
                          borderColor: theme.colors.error,
                          backgroundColor: theme.colors.error,
                        },
                        ruCorrect && {
                          borderColor: theme.colors.primary,
                          backgroundColor: "#4CAF50",
                        },
                      ]}
                      onPress={() => handleSelectRu(ruId)}
                    >
                      <Text
                        style={[
                          styles.wordText,
                          { color: theme.colors.onSurfaceVariant },
                        ]}
                      >
                        {ruWord.word_ru}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.cell}>
                  {enId !== undefined && enWord && (
                    <TouchableOpacity
                      style={[
                        styles.wordChip,
                        {
                          backgroundColor: theme.colors.surfaceVariant,
                          borderColor: theme.colors.outline,
                        },
                        enSelected && {
                          borderColor: theme.colors.primary,
                          backgroundColor: theme.colors.outline,
                        },
                        enIncorrect && {
                          borderColor: theme.colors.error,
                          backgroundColor: theme.colors.error,
                        },
                        enCorrect && {
                          borderColor: theme.colors.secondary,
                          backgroundColor: "#4CAF50",
                        },
                      ]}
                      onPress={() => handleSelectEn(enId)}
                    >
                      <Text
                        style={[
                          styles.wordText,
                          { color: theme.colors.onSurfaceVariant },
                        ]}
                      >
                        {enWord.word_en}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.progressRow}>
          <Text style={[styles.progressText, { color: theme.colors.onPrimary }]}>
            Solved {solvedIds.length} / {wordsPool.length}
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
          onPress={stopGame}
          style={[
            styles.controlButton,
            { backgroundColor: theme.colors.errorContainer },
          ]}
          icon="stop"
        >
          Stop
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
    marginBottom: 16,
  },
  gameArea: {
    flex: 1,
    minHeight: 260,
  },
  columnsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  columnTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  rows: {
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 10,
  },
  cell: {
    flex: 1,
  },
  wordChip: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    minHeight: 52,
    justifyContent: "center",
  },
  wordText: {
    fontSize: 16,
    fontWeight: "600",
  },
  progressRow: {
    marginTop: 12,
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
});


