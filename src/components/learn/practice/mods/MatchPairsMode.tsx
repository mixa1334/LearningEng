import { getCardShadow } from "@/src/components/common/cardShadow";
import { useAppTheme } from "@/src/components/common/ThemeProvider";
import { Word } from "@/src/entity/types";
import { usePractice } from "@/src/hooks/usePractice";
import { shuffleArray } from "@/src/util/shuffleArray";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useHaptics } from "@/src/components/common/HapticsProvider";
import { useSoundPlayer } from "@/src/components/common/SoundProvider";
import { useLanguageContext } from "../../../common/LanguageProvider";
import { PracticeModeChildProps } from "../PracticeModeWrapper";
const VISIBLE_PAIRS = 5;
const HIGHLIGHT_DELAY = 400;

type WordTextPlate = {
  text: string;
  wordId: number;
  isEnglish: boolean;
  isComplete: boolean;
};

const toWordTextPlate = (word: Word, isEnglish: boolean): WordTextPlate => {
  return {
    text: isEnglish ? word.word_en : word.word_ru,
    wordId: word.id,
    isEnglish,
    isComplete: false,
  };
};

export default function MatchPairsMode({ onEndCurrentSet }: Readonly<PracticeModeChildProps>) {
  const { words } = usePractice();
  const theme = useAppTheme();
  const { text } = useLanguageContext();
  const { successNotification, errorNotification } = useHaptics();
  const { playAccepted, playRejected } = useSoundPlayer();
  const [hasFinished, setHasFinished] = useState(words.length === 0);

  const [mistakesCount, setMistakesCount] = useState(0);

  const [remainingPool, setRemainingPool] = useState(words);
  const [ruPlates, setRuPlates] = useState(() =>
    shuffleArray(remainingPool.slice(0, VISIBLE_PAIRS).map((w) => toWordTextPlate(w, false)))
  );
  const [engPlates, setEngPlates] = useState(() =>
    shuffleArray(remainingPool.slice(0, VISIBLE_PAIRS).map((w) => toWordTextPlate(w, true)))
  );
  const [platesRemainingCount, setPlatesRemainingCount] = useState(engPlates.length);

  const [selectedPlate, setSelectedPlate] = useState<WordTextPlate | null>(null);
  const [pairMatch, setPairMatch] = useState<{ ruPlate: WordTextPlate; engPlate: WordTextPlate; isCorrect: boolean } | null>(
    null
  );

  useEffect(() => {
    if (platesRemainingCount > 0) return;
    const visiblePool = remainingPool.slice(0, VISIBLE_PAIRS);
    setPlatesRemainingCount(visiblePool.length);
    setRuPlates(shuffleArray(visiblePool.map((w) => toWordTextPlate(w, false))));
    setEngPlates(shuffleArray(visiblePool.map((w) => toWordTextPlate(w, true))));
  }, [remainingPool, platesRemainingCount]);

  useEffect(() => {
    if (!hasFinished && (ruPlates.length === 0 || engPlates.length === 0)) {
      setHasFinished(true);
      onEndCurrentSet?.(
        text("practice_pairs_end_message", {
          mistakes: mistakesCount,
          total: words.length,
        })
      );
    }
  }, [ruPlates, engPlates, mistakesCount, words.length, onEndCurrentSet, hasFinished, text]);

  useEffect(() => {
    if (pairMatch === null) return;
    const timeout = setTimeout(() => {
      if (pairMatch.isCorrect) {
        const mapRuleForCompletedPlates = (plate: WordTextPlate) => {
          if (plate.wordId === pairMatch.ruPlate.wordId && plate.wordId === pairMatch.engPlate.wordId) {
            return { ...plate, isComplete: true };
          }
          return plate;
        };
        setRuPlates((prev) => prev.map(mapRuleForCompletedPlates));
        setEngPlates((prev) => prev.map(mapRuleForCompletedPlates));
        setPlatesRemainingCount((prev) => prev - 1);
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
      playAccepted();
      successNotification();
    } else {
      playRejected();
      errorNotification();
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
    const isComplete = plate.isComplete;

    if (isComplete) {
      return (
        <View style={[styles.plate, { backgroundColor: colors.surfaceVariant, borderColor: colors.outline }]}>
          <Text style={[styles.plateText, { color: colors.surfaceVariant }]}>{plate.text}</Text>
        </View>
      );
    }

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
      <View style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }, getCardShadow(theme)]}>
        <View style={styles.headerRow}>
          <Text style={[styles.headerLabel, { color: theme.colors.onSurfaceVariant }]}>
            {text("practice_pairs_ru_label")}
          </Text>
          <Text style={[styles.headerLabel, { color: theme.colors.onSurfaceVariant }]}>
            {text("practice_pairs_en_label")}
          </Text>
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
