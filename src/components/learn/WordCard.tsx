import { Word } from "@/src/entity/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";

import { useLanguageContext } from "../common/LanguageProvider";
import { useAppTheme } from "../common/ThemeProvider";
import { getCardShadow } from "../common/cardShadow";

interface WordCardProps {
  readonly word: Word;
  readonly accept: (word: Word) => void;
  readonly acceptBtnName: string;
  readonly reject: (word: Word) => void;
  readonly rejectBtnName: string;
}

export default function WordCard({ word, accept, acceptBtnName, reject, rejectBtnName }: WordCardProps) {
  const [showTranslation, setShowTranslation] = useState(false);
  const [pending, setPending] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [isEnglishPrimary, setIsEnglishPrimary] = useState(true);
  const theme = useAppTheme();
  const { height } = useWindowDimensions();
  const { text } = useLanguageContext();

  useEffect(() => {
    setShowTranslation(false);
    setPending(false);
    setAccepted(false);
    setIsEnglishPrimary(Math.random() < 0.5);
  }, [word.id]);

  const questionText = isEnglishPrimary ? word.word_en : word.word_ru;
  const answerText = isEnglishPrimary ? word.word_ru : word.word_en;

  const cardHeight = height * 0.4;

  const handleShowTranslation = () => setShowTranslation(true);

  const handleUserInput = (action: (word: Word) => void) => {
    if (showTranslation) {
      setShowTranslation(false);
      setPending(false);
      setAccepted(false);
      action(word);
    } else {
      setShowTranslation(true);
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

        {showTranslation ? (
          <Text style={[styles.translation, { color: theme.colors.onSurface }]} numberOfLines={3}>
            {answerText}
          </Text>
        ) : (
          <TouchableOpacity style={[styles.eyeBtn, { backgroundColor: theme.colors.surface }]} onPress={handleShowTranslation}>
            <Ionicons name="eye-outline" size={22} color={theme.colors.onSurface} />
            <Text style={[styles.eyeText, { color: theme.colors.onSurface }]}>{text("word_show_translation")}</Text>
          </TouchableOpacity>
        )}

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
  translation: {
    fontSize: 20,
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "600",
  },
  example: {
    fontSize: 15,
    marginBottom: 20,
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 20,
  },
  eyeBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  eyeText: {
    marginLeft: 6,
    fontWeight: "600",
    fontSize: 14,
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
