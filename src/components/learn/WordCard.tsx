import { Word } from "@/src/entity/types";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import Animated, { FadeIn, FadeInDown, Layout } from "react-native-reanimated";

import { Ionicons } from "@expo/vector-icons";
import HiddenValue from "../common/HiddenValue";
import { useLanguageContext } from "../common/LanguageProvider";
import { useSoundPlayer } from "../common/SoundProvider";
import { useAppTheme } from "../common/ThemeProvider";

interface WordCardProps {
  readonly word: Word;
  readonly accept: (word: Word) => void;
  readonly acceptBtnName: string;
  readonly reject: (word: Word) => void;
  readonly rejectBtnName: string;
}

export default function WordCard({ word, accept, acceptBtnName, reject, rejectBtnName }: WordCardProps) {
  const [pending, setPending] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [isEnglishPrimary, setIsEnglishPrimary] = useState(true);
  const [isVisibleTranslation, setIsVisibleTranslation] = useState(false);
  const theme = useAppTheme();
  const { height } = useWindowDimensions();
  const { text } = useLanguageContext();
  const { playAccepted, playRejected } = useSoundPlayer();
  
  useEffect(() => {
    setPending(false);
    setAccepted(false);
    setIsVisibleTranslation(false);
    setIsEnglishPrimary(Math.random() < 0.5);
  }, [word.id]);

  const questionText = isEnglishPrimary ? word.word_en : word.word_ru;
  const answerText = isEnglishPrimary ? word.word_ru : word.word_en;

  const cardMinHeight = height * 0.45;

  const handleUserInput = (action: (word: Word) => void) => {
    if (isVisibleTranslation) {
      setPending(false);
      setIsVisibleTranslation(false);
      setAccepted(false);
      action(word);
    } else {
      setIsVisibleTranslation(true);
      setPending(true);
    }
  };

  const handleAccept = () => {
    playAccepted();
    handleUserInput(accept);
    setAccepted(true);
  };
  const handleReject = () => {
    playRejected();
    handleUserInput(reject);
    setAccepted(false);
  };
  const handleContinue = () => {
    handleUserInput(accepted ? accept : reject);
  };

  const showTranslation = () => {
    setIsVisibleTranslation(true);
  }

  return (
    <View style={styles.container}>
      <Animated.View
        layout={Layout.springify()}
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.outline,
            minHeight: cardMinHeight,
          },
        ]}
      >
        <View style={styles.content}>
          <View style={[styles.categoryBadge, { backgroundColor: theme.colors.secondaryContainer }]}>
            <Text style={[styles.categoryText, { color: theme.colors.onSecondaryContainer }]}>
              {word.category.icon} {word.category.name}
            </Text>
          </View>

          <Animated.Text 
            entering={FadeInDown.delay(100).springify()}
            key={`q-${word.id}`}
            style={[styles.word, { color: theme.colors.onSurface }]}
          >
            {questionText}
          </Animated.Text>

          <View style={styles.answerContainer}>
            <HiddenValue 
                value={answerText}
                isVisible={isVisibleTranslation}
                onShowCallback={showTranslation}
                containerStyle={{ marginBottom: 16 }}
            />
            {isVisibleTranslation && (
                <Animated.View entering={FadeIn.duration(400)} style={{ alignItems: 'center', width: '100%' }}>
                     <View style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />
                     <Text style={[styles.example, { color: theme.colors.onSurfaceVariant }]}>
                        {word.text_example}
                    </Text>
                </Animated.View>
            )}
          </View>
        </View>

        <View style={styles.bottomBar}>
          {pending ? (
             <Animated.View entering={FadeInDown.springify()} style={{ width: '100%' }}>
                <TouchableOpacity 
                    style={[styles.btnBase, styles.btnContinue, { backgroundColor: theme.colors.primary }]} 
                    onPress={handleContinue}
                >
                    <Text style={[styles.btnText, { color: theme.colors.onPrimary }]}>
                        {text("word_continue_button")}
                    </Text>
                    <Ionicons name="arrow-forward" size={20} color={theme.colors.onPrimary} />
                </TouchableOpacity>
            </Animated.View>
          ) : (
            <Animated.View entering={FadeInDown.springify()} style={styles.actionsRow}>
              
              <TouchableOpacity 
                style={[styles.btnBase, { backgroundColor: theme.colors.accept }]} 
                onPress={handleAccept}
              >
                <Ionicons name="checkmark-circle-outline" size={24} color={theme.colors.onAcceptReject} />
                <Text 
                  style={[styles.btnText, { color: theme.colors.onAcceptReject }]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {acceptBtnName}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.btnBase, { backgroundColor: theme.colors.reject}]} 
                onPress={handleReject}
              >
                 <Ionicons name="close-circle-outline" size={24} color={theme.colors.onAcceptReject} />
                <Text 
                  style={[styles.btnText, { color: theme.colors.onAcceptReject }]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {rejectBtnName}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  card: {
    width: "100%",
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 24,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  word: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 24,
    textAlign: "center",
  },
  answerContainer: {
    alignItems: 'center',
    width: '100%',
  },
  divider: {
    height: 1,
    width: 60,
    marginBottom: 16,
  },
  example: {
    fontSize: 16,
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 24,
    opacity: 0.8,
  },
  bottomBar: {
    marginTop: 32,
    width: "100%",
  },
  actionsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  btnBase: {
    flex: 1,
    flexBasis: 0,
    flexDirection: 'row',
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  btnContinue: {
      width: '100%',
      flexBasis: 'auto',
  },
  btnText: {
    fontWeight: "700",
    fontSize: 16,
    flexShrink: 1,
  },
});
