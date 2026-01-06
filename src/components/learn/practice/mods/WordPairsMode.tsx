import { Word } from "@/src/entity/types";
import { usePractice } from "@/src/hooks/usePractice";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";
import { useAppTheme } from "../../../common/ThemeProvider";
import { PracticeModeChildProps } from "../PracticeModeWrapper";

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

export default function WordPairsMode(props: PracticeModeChildProps) {
  const theme = useAppTheme();
  const { words } = usePractice();

  const [sessionWords, setSessionWords] = useState<Word[]>([]);
  const [visibleIds, setVisibleIds] = useState<number[]>([]);
  const [solvedIds, setSolvedIds] = useState<number[]>([]);
  const [englishOrder, setEnglishOrder] = useState<number[]>([]);

  const [selectedRuId, setSelectedRuId] = useState<number | null>(null);
  const [selectedEnId, setSelectedEnId] = useState<number | null>(null);
  const [incorrectPair, setIncorrectPair] = useState<IncorrectPair>(null);
  const [correctPair, setCorrectPair] = useState<CorrectPair>(null);

  const resetGame = () => {
    const shuffled = shuffleArray(words);
    const maxVisible = Math.min(VISIBLE_PAIRS, shuffled.length);
    const visible = shuffled.slice(0, maxVisible).map((w) => w.id);

    setSessionWords(shuffled);
    setVisibleIds(visible);
    setSolvedIds([]);
    setEnglishOrder(shuffleArray(visible));
    setSelectedRuId(null);
    setSelectedEnId(null);
    setIncorrectPair(null);
  };

  useEffect(() => {
    resetGame();
  }, [words]);

  const stopGame = () => {
    props.onEndSession?.(`You solved ${solvedIds.length} / ${words.length} pairs`);
  };

  const getWordById = (id: number) => {
    return sessionWords.find((w) => w.id === id);
  };

  const handleSelectRu = (id: number) => {
    if (incorrectPair || correctPair) return;
    setSelectedRuId((prev) => (prev === id ? null : id));
  };

  const handleSelectEn = (id: number) => {
    if (incorrectPair || correctPair) return;
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
      props.onEndCurrentSet?.(`You solved ${solvedIds.length + 1} / ${words.length} pairs`);
      // return;
    }

    const shuffledVisible = shuffleArray(updatedVisible);
    const shuffledEnglish = shuffleArray(updatedVisible);

    setSolvedIds(newSolved);
    setVisibleIds(shuffledVisible);
    setEnglishOrder(shuffledEnglish);
    setIncorrectPair(null);
  };

  useEffect(() => {
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
  }, [selectedRuId, selectedEnId]);

  return (
    <View style={styles.container}>
      <View style={styles.sessionContent}>
        <View style={[styles.progressCard, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.progressText, { color: theme.colors.onPrimary }]}>
            Solved: {solvedIds.length} / {words.length}
          </Text>
          <Button
            mode="contained-tonal"
            onPress={stopGame}
            style={[styles.endBtn, { backgroundColor: theme.colors.reject }]}
            textColor={theme.colors.onAcceptReject}
            icon="flag-checkered"
          >
            End
          </Button>
        </View>

        <View style={[styles.modeCard, { backgroundColor: theme.colors.primary }]}>
          <View style={styles.gameArea}>
            <View style={styles.columnsHeader}>
              <Text style={[styles.columnTitle, { color: theme.colors.onPrimary }]}>Russian</Text>
              <Text style={[styles.columnTitle, { color: theme.colors.onPrimary }]}>English</Text>
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
                  <View key={`row-${ruId}-${enId ?? "none"}`} style={styles.row}>
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
                          <Text style={[styles.wordText, { color: theme.colors.onSurfaceVariant }]}>{ruWord.word_ru}</Text>
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
                          <Text style={[styles.wordText, { color: theme.colors.onSurfaceVariant }]}>{enWord.word_en}</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sessionContent: {
    flex: 1,
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
    minHeight: 350,
  },
  modeCard: {
    justifyContent: "flex-start",
    borderRadius: 20,
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
    width: "100%",
    alignItems: "stretch",
  },
  cell: {
    flex: 1,
  },
  wordChip: {
    flex: 1,
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
  endBtn: {
    borderRadius: 8,
  },
});
