import { getCardShadow } from "@/src/components/common/cardShadow";
import { usePractice } from "@/src/hooks/usePractice";
import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { useAutoScroll } from "../../common/AutoScrollContext";
import { useLanguageContext } from "../../common/LanguageProvider";
import { LoadingContentSpinner } from "../../common/LoadingContentSpinner";
import { useAppTheme } from "../../common/ThemeProvider";
import { useSoundPlayer } from "@/src/components/common/SoundProvider";

export type PracticeModeChildProps = {
  readonly onEndCurrentSet?: (endMessage: string) => void;
};

interface PracticeModeWrapperProps {
  readonly practiceWordsPoolLengthRule: (wordsPoolLength: number) => boolean;
  readonly children: React.ReactElement<PracticeModeChildProps>;
}

export default function PracticeModeWrapper({ practiceWordsPoolLengthRule, children }: PracticeModeWrapperProps) {
  const { triggerScroll } = useAutoScroll();
  const theme = useAppTheme();
  const { words, loadNextPracticeSet, resetPracticeSet } = usePractice();

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [childTextMessage, setChildTextMessage] = useState("");
  const [isSetEnded, setIsSetEnded] = useState(false);
  const [isOverLoadedSession, setIsOverLoadedSession] = useState(false);
  const { text } = useLanguageContext();
  const { playActionSuccess } = useSoundPlayer();
  
  const performTransition = useCallback(
    async (action: () => void) => {
      setIsTransitioning(true);
      action();
      setTimeout(() => {
        setIsTransitioning(false);
        triggerScroll();
      }, 300);
    },
    [triggerScroll]
  );

  const handleEndCurrentSet = useCallback((endMessage: string) => {
    playActionSuccess();
    setIsSetEnded(true);
    setChildTextMessage(endMessage);
    setIsOverLoadedSession(true);
  }, [playActionSuccess]);

  const resetPracticeSession = () => {
    performTransition(() => {
      resetPracticeSet();
      setIsSetEnded(false);
    });
  };

  const loadMoreWordsToLearn = () => {
    performTransition(() => {
      loadNextPracticeSet();
      setIsSetEnded(false);
    });
  };

  if (isTransitioning) {
    return (
      <View style={{ paddingTop: 60 }}>
        <LoadingContentSpinner />
      </View>
    );
  }

  const noWordsToReview = !practiceWordsPoolLengthRule(words.length);
  if (noWordsToReview && !isSetEnded) {
    return (
      <View
        style={[
          styles.centered,
          { backgroundColor: theme.colors.surfaceVariant, borderRadius: 16, width: "100%" },
          getCardShadow(theme),
        ]}
      >
        <Text style={[styles.infoText, { color: theme.colors.onSurface }]}>
          {text("practice_no_words_message")}
        </Text>
        {isOverLoadedSession && (
          <Button
            mode="contained-tonal"
            onPress={resetPracticeSession}
            icon="restart"
            style={[styles.btn, { backgroundColor: theme.colors.primary }]}
            textColor={theme.colors.onPrimary}
          >
            {text("practice_start_over_button")}
          </Button>
        )}
      </View>
    );
  }

  if (isSetEnded) {
    return (
      <View
        style={[
          styles.centered,
          { backgroundColor: theme.colors.surfaceVariant, borderRadius: 16, width: "100%" },
          getCardShadow(theme),
        ]}
      >
        <Text style={[styles.resultText, { color: theme.colors.onSurface }]}>{childTextMessage}</Text>
        <Button
          mode="contained-tonal"
          onPress={loadMoreWordsToLearn}
          icon="play"
          style={[styles.btn, { backgroundColor: theme.colors.primary }]}
          textColor={theme.colors.onPrimary}
        >
          {text("practice_continue_button")}
        </Button>
      </View>
    );
  }

  return React.cloneElement(children, {
    onEndCurrentSet: handleEndCurrentSet,
    key: `set-${words.length}-${words[0]?.id || "init"}`,
  });
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: 8,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 12,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  resultText: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
});
