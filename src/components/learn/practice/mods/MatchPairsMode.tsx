import { useAppTheme } from "@/src/components/common/ThemeProvider";
import { Word } from "@/src/entity/types";
import { usePractice } from "@/src/hooks/usePractice";
import { shuffleArray } from "@/src/util/arrayHelper";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { PracticeModeChildProps } from "../PracticeModeWrapper";
const VISIBLE_PAIRS = 5;
const HIGHLIGHT_DELAY = 400;

type WordTextPlate = {
  text: string;
  wordId: number;
  isEnglish: boolean;
};

const toWordTextPlate = (word: Word, isEnglish: boolean): WordTextPlate => {
  return {
    text: isEnglish ? word.word_en : word.word_ru,
    wordId: word.id,
    isEnglish,
  };
};

export default function MatchPairsMode({ onEndCurrentSet }: PracticeModeChildProps) {
  const { words } = usePractice();
  const theme = useAppTheme();

  const [hasFinished, setHasFinished] = useState(words.length === 0);

  const [mistakesCount, setMistakesCount] = useState(0);

  const [remainingPool, setRemainingPool] = useState(words);
  const [ruPlates, setRuPlates] = useState(() =>
    shuffleArray(remainingPool.slice(0, VISIBLE_PAIRS).map((w) => toWordTextPlate(w, false)))
  );
  const [engPlates, setEngPlates] = useState(() =>
    shuffleArray(remainingPool.slice(0, VISIBLE_PAIRS).map((w) => toWordTextPlate(w, true)))
  );

  const [selectedPlate, setSelectedPlate] = useState<WordTextPlate | null>(null);
  const [pairMatch, setPairMatch] = useState<{ ruPlate: WordTextPlate; engPlate: WordTextPlate; isCorrect: boolean } | null>(
    null
  );

  useEffect(() => {
    const visiblePool = remainingPool.slice(0, VISIBLE_PAIRS);
    setRuPlates(shuffleArray(visiblePool.map((w) => toWordTextPlate(w, false))));
    setEngPlates(shuffleArray(visiblePool.map((w) => toWordTextPlate(w, true))));
  }, [remainingPool]);

  useEffect(() => {
    if (!hasFinished && (ruPlates.length === 0 || engPlates.length === 0)) {
      setHasFinished(true);
      onEndCurrentSet?.(`You made ${mistakesCount} mistakes while solving ${words.length} pairs`);
    }
  }, [ruPlates, engPlates, mistakesCount, words.length, onEndCurrentSet, hasFinished]);

  useEffect(() => {
    if (pairMatch === null) return;
    const timeout = setTimeout(() => {
      if (pairMatch.isCorrect) {
        setRemainingPool((prev) => prev.filter((w) => w.id !== pairMatch.ruPlate.wordId && w.id !== pairMatch.engPlate.wordId));
      } else {
        setMistakesCount((prev) => prev + 1);
      }
      setPairMatch(null);
    }, HIGHLIGHT_DELAY);
    return () => clearTimeout(timeout);
  }, [pairMatch]);

  const handleSelectPlate = (plate: WordTextPlate) => {
    if (pairMatch !== null) return;

    if (selectedPlate === null) {
      setSelectedPlate(plate);
      return;
    }

    if (selectedPlate.wordId === plate.wordId && selectedPlate.isEnglish === plate.isEnglish) {
      setSelectedPlate(null);
      return;
    }

    if (selectedPlate.isEnglish === plate.isEnglish) return;
    const isCorrect = selectedPlate.wordId === plate.wordId;
    const pair = {
      ruPlate: selectedPlate.isEnglish ? plate : selectedPlate,
      engPlate: selectedPlate.isEnglish ? selectedPlate : plate,
      isCorrect,
    };
    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    setPairMatch(pair);
    setSelectedPlate(null);
  };

  const renderPlate = (plate: WordTextPlate) => {
    const { colors } = theme;

    const isSelected = selectedPlate?.wordId === plate.wordId && selectedPlate?.isEnglish === plate.isEnglish;

    const isRuPair = pairMatch?.ruPlate.wordId === plate.wordId && !plate.isEnglish;
    const isEngPair = pairMatch?.engPlate.wordId === plate.wordId && plate.isEnglish;
    const isInPair = !!pairMatch && (isRuPair || isEngPair);
    const isCorrectPair = isInPair && pairMatch?.isCorrect;
    const isIncorrectPair = isInPair && pairMatch && !pairMatch.isCorrect;

    return (
      <Pressable
        key={`${plate.wordId}-${plate.isEnglish ? "en" : "ru"}`}
        onPress={() => handleSelectPlate(plate)}
        disabled={!!pairMatch}
        style={({ pressed }) => [
          styles.plate,
          {
            backgroundColor: colors.onSurfaceVariant,
            borderColor: colors.outline,
          },
          pressed &&
            !isInPair && {
              opacity: 0.8,
              transform: [{ scale: 0.97 }],
            },
          isSelected &&
            !isInPair && {
              backgroundColor: colors.primaryContainer,
              borderColor: colors.primary,
            },
          isCorrectPair && {
            backgroundColor: colors.accept,
            borderColor: colors.accept,
          },
          isIncorrectPair && {
            backgroundColor: colors.reject,
            borderColor: colors.reject,
          },
        ]}
      >
        <Text
          style={[
            styles.plateText,
            { color: colors.surface },
            (isCorrectPair || isIncorrectPair) && {
              color: colors.onAcceptReject,
            },
            isSelected && {
              color: colors.onPrimaryContainer,
            },
          ]}
        >
          {plate.text}
        </Text>
      </Pressable>
    );
  };

  if (hasFinished) return null;

  const size = Math.min(ruPlates.length, engPlates.length, VISIBLE_PAIRS);

  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}>
        <View style={styles.headerRow}>
          <Text style={[styles.headerLabel, { color: theme.colors.onSurfaceVariant }]}>RU words</Text>
          <Text style={[styles.headerLabel, { color: theme.colors.onSurfaceVariant }]}>EN words</Text>
        </View>

        <View style={styles.rows}>
          {Array.from({ length: size }).map((_, index) => (
            <View key={index} style={styles.row}>
              {renderPlate(ruPlates[index])}
              {renderPlate(engPlates[index])}
            </View>
          ))}
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
  card: {
    flex: 1,
    borderRadius: 20,
    padding: 10,
    marginVertical: 16,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  headerLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  rows: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 12,
    marginBottom: 10,
  },
  plate: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  plateText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
