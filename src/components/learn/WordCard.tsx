import { Word } from "@/src/entity/types";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";

import { getCardShadow } from "../common/cardShadow";
import HiddenValue from "../common/HiddenValue";
import { useLanguageContext } from "../common/LanguageProvider";
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

  useEffect(() => {
    setPending(false);
    setAccepted(false);
    setIsVisibleTranslation(false);
    setIsEnglishPrimary(Math.random() < 0.5);
  }, [word.id]);

  const questionText = isEnglishPrimary ? word.word_en : word.word_ru;
  const answerText = isEnglishPrimary ? word.word_ru : word.word_en;

  const cardHeight = height * 0.4;

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
    handleUserInput(accept);
    setAccepted(true);
  };
  const handleReject = () => {
    handleUserInput(reject);
    setAccepted(false);
  };
  const handleContinue = () => {
    handleUserInput(accepted ? accept : reject);
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surfaceVariant,
          minHeight: cardHeight,
        },
        getCardShadow(theme),
      ]}
    >
      <View style={styles.content}>
        <Text style={[styles.category, { color: theme.colors.onSurfaceVariant }]}>
          {word.category.icon} {word.category.name}
        </Text>
        <Text style={[styles.word, { color: theme.colors.onSurface }]}>{questionText}</Text>

        <HiddenValue value={answerText} isVisible={pending} onShowCallback={() => setIsVisibleTranslation(true)} />

        <Text style={[styles.example, { color: theme.colors.onSurfaceVariant }]} numberOfLines={3}>
          {word.text_example}
        </Text>
      </View>

      <View style={styles.bottomBar}>
        {pending ? (
          <TouchableOpacity style={[styles.btnBase, { backgroundColor: theme.colors.accept }]} onPress={handleContinue}>
            <Text style={[styles.btnText, { color: theme.colors.onAcceptReject }]} numberOfLines={1} adjustsFontSizeToFit>
              {text("word_continue_button")}
            </Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity style={[styles.btnBase, { backgroundColor: theme.colors.accept }]} onPress={handleAccept}>
              <Text style={[styles.btnText, { color: theme.colors.onAcceptReject }]} numberOfLines={1} adjustsFontSizeToFit>
                {acceptBtnName}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btnBase, { backgroundColor: theme.colors.reject }]} onPress={handleReject}>
              <Text style={[styles.btnText, { color: theme.colors.onAcceptReject }]} numberOfLines={1} adjustsFontSizeToFit>
                {rejectBtnName}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    borderRadius: 20,
    alignSelf: "center",
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  category: {
    fontWeight: "600",
    marginBottom: 8,
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  word: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  example: {
    fontSize: 15,
    marginBottom: 20,
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 20,
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingTop: 12,
  },
  btnBase: {
    flex: 1,
    height: "100%",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginHorizontal: 6,
    alignItems: "center",
  },
  btnText: {
    fontWeight: "600",
    fontSize: 16,
  },
});
