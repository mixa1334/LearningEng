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
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { MaterialIcons } from "@expo/vector-icons";

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
      <Animated.View
        entering={FadeInDown.springify()}
        style={[
          styles.centered,
          { backgroundColor: theme.colors.surfaceVariant },
          getCardShadow(theme),
        ]}
      >
        <MaterialIcons name="info-outline" size={48} color={theme.colors.onSurfaceVariant} style={{ marginBottom: 16 }} />
        <Text style={[styles.infoText, { color: theme.colors.onSurface }]}>
          {text("practice_no_words_message")}
        </Text>
        {isOverLoadedSession && (
          <Button
            mode="contained"
            onPress={resetPracticeSession}
            icon="restart"
            style={[styles.btn, { backgroundColor: theme.colors.primary }]}
            textColor={theme.colors.onPrimary}
          >
            {text("practice_start_over_button")}
          </Button>
        )}
      </Animated.View>
    );
  }

  if (isSetEnded) {
    return (
      <Animated.View
        entering={FadeInDown.springify()}
        style={[
          styles.centered,
          { backgroundColor: theme.colors.surfaceVariant },
          getCardShadow(theme),
        ]}
      >
        <MaterialIcons name="emoji-events" size={64} color={theme.colors.primary} style={{ marginBottom: 16 }} />
        <Text style={[styles.resultText, { color: theme.colors.onSurface }]}>{childTextMessage}</Text>
        <Button
          mode="contained"
          onPress={loadMoreWordsToLearn}
          icon="play"
          style={[styles.btn, { backgroundColor: theme.colors.primary }]}
          textColor={theme.colors.onPrimary}
          contentStyle={{ height: 48 }}
        >
          {text("practice_continue_button")}
        </Button>
      </Animated.View>
    );
  }

  return (
      <Animated.View entering={FadeIn} style={{ flex: 1 }}>
        {React.cloneElement(children, {
            onEndCurrentSet: handleEndCurrentSet,
            key: `set-${words.length}-${words[0]?.id || "init"}`,
        })}
      </Animated.View>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: 12,
    marginTop: 16,
    width: "100%",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    gap: 12,
    borderRadius: 24,
    minHeight: 300,
  },
  infoText: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
  },
  resultText: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
});
