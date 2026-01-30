import { useHaptics } from "@/src/components/common/HapticsProvider";
import { useLanguageContext } from "@/src/components/common/LanguageProvider";
import { useSoundPlayer } from "@/src/components/common/SoundProvider";
import { useAppTheme } from "@/src/components/common/ThemeProvider";
import { Word } from "@/src/entity/types";
import { usePractice } from "@/src/hooks/usePractice";
import { shuffleArray } from "@/src/util/shuffleArray";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { Layout, ZoomIn, ZoomOut } from "react-native-reanimated";
import { useAutoScroll } from "../../../common/AutoScrollContext";
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
  const { triggerScroll } = useAutoScroll();
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
    triggerScroll();
  }, [remainingPool, platesRemainingCount, triggerScroll]);

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

  const renderPlate = (plate: WordTextPlate, index: number) => {
    const { colors } = theme;

    const isSelected = selectedPlate?.wordId === plate.wordId && selectedPlate?.isEnglish === plate.isEnglish;

    const isRuPair = pairMatch?.ruPlate.wordId === plate.wordId && !plate.isEnglish;
    const isEngPair = pairMatch?.engPlate.wordId === plate.wordId && plate.isEnglish;
    const isInPair = !!pairMatch && (isRuPair || isEngPair);
    const isCorrectPair = isInPair && pairMatch?.isCorrect;
    const isIncorrectPair = isInPair && pairMatch && !pairMatch.isCorrect;
    const isComplete = plate.isComplete;

    return (
      <View style={{ flex: 1 }}>
        {isComplete ? (
          <View style={[styles.plate, styles.platePlaceholder]} />
        ) : (
          <Animated.View
            entering={ZoomIn.delay(index * 50).springify()}
            exiting={ZoomOut}
            layout={Layout.springify()}
            style={{ flex: 1 }}
          >
            <Pressable
              key={`${plate.wordId}-${plate.isEnglish ? "en" : "ru"}`}
              onPress={() => handleSelectPlate(plate)}
              disabled={!!pairMatch}
              style={({ pressed }) => [
                styles.plate,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.outline,
                },
                pressed &&
                  !isInPair && {
                    backgroundColor: colors.surfaceVariant,
                    transform: [{ scale: 0.96 }],
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
                  { color: colors.onSurface },
                  (isCorrectPair || isIncorrectPair) && {
                    color: colors.onAcceptReject,
                  },
                  isSelected && {
                    color: colors.onPrimaryContainer,
                  },
                ]}
                numberOfLines={2}
                adjustsFontSizeToFit
              >
                {plate.text}
              </Text>
            </Pressable>
          </Animated.View>
        )}
      </View>
    );
  };

  if (hasFinished) return null;

  const size = Math.min(ruPlates.length, engPlates.length, VISIBLE_PAIRS);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
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
              {renderPlate(ruPlates[index], index)}
              {renderPlate(engPlates[index], index)}
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
    padding: 16,
  },
  content: {
    flex: 1,
    borderRadius: 24,
    // No shadow, handled by layout
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  headerLabel: {
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  rows: {
    flex: 1,
    gap: 12,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "stretch",
    gap: 12,
  },
  plate: {
    flex: 1,
    height: '100%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  platePlaceholder: {
      borderColor: 'transparent',
      backgroundColor: 'transparent',
      elevation: 0,
  },
  plateText: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: 'center',
  },
});
