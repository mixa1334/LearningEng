import { Word } from "@/model/entity/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useTheme } from "react-native-paper";

interface WordCardProps {
  readonly word: Word;
  readonly accept: () => void;
  readonly acceptBtnName: string;
  readonly reject: () => void;
  readonly rejectBtnName: string;
}

export default function WordCard({
  word,
  accept,
  acceptBtnName,
  reject,
  rejectBtnName,
}: WordCardProps) {
  const [showTranslation, setShowTranslation] = useState(false);
  const [pending, setPending] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const theme = useTheme();
  const { width, height } = useWindowDimensions();

  const cardWidth = Math.min(width * 0.9, 420);
  const cardHeight = Math.min(height * 0.45, 380);
  const isNarrow = cardWidth < 360;
  const acceptColor = theme.dark ? "#2E7D32" : "#4CAF50";
  const cardBackground =
    (theme.colors as any).primaryContainer ?? theme.colors.surface;
  const primaryTextColor =
    (theme.colors as any).onPrimaryContainer ?? theme.colors.onSurface;
  const secondaryTextColor =
    (theme.colors as any).onSecondaryContainer ??
    theme.colors.onSurfaceVariant;

  const handleShowTranslation = () => setShowTranslation(true);

  const handleUserInput = (action: () => void) => {
    if (pending) {
      setShowTranslation(false);
      setPending(false);
      setAccepted(false);
      action();
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
          backgroundColor: cardBackground,
          width: cardWidth,
          minHeight: cardHeight,
        },
      ]}
    >
      <Text style={[styles.category, { color: secondaryTextColor }]}>
        {word.category.icon} {word.category.name}
      </Text>
      <Text style={[styles.word, { color: primaryTextColor }]}>
        {word.word_en} {word.transcription}
      </Text>

      {showTranslation ? (
        <Text
          style={[styles.translation, { color: theme.colors.primary }]}
          numberOfLines={3}
        >
          {word.word_ru}
        </Text>
      ) : (
        <TouchableOpacity style={styles.eyeBtn} onPress={handleShowTranslation}>
          <Ionicons name="eye-outline" size={22} color={theme.colors.primary} />
          <Text style={[styles.eyeText, { color: theme.colors.primary }]}>
            Show translation
          </Text>
        </TouchableOpacity>
      )}

      <Text
        style={[styles.example, { color: secondaryTextColor }]}
        numberOfLines={3}
      >
        {word.text_example}
      </Text>

      <View
        style={[
          styles.bottomBar,
          isNarrow ? styles.bottomBarVertical : undefined,
        ]}
      >
        {pending ? (
          <TouchableOpacity
            style={[
              styles.btnBase,
              isNarrow && styles.btnFullWidth,
              { backgroundColor: acceptColor },
            ]}
            onPress={handleContinue}
          >
            <Text style={styles.btnText} numberOfLines={1} adjustsFontSizeToFit>
              Continue
            </Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={[
                styles.btnBase,
                isNarrow && styles.btnFullWidth,
                { backgroundColor: acceptColor },
              ]}
              onPress={handleAccept}
            >
              <Text style={styles.btnText} numberOfLines={1} adjustsFontSizeToFit>
                {acceptBtnName}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.btnBase,
                isNarrow && styles.btnFullWidth,
                { backgroundColor: theme.colors.error },
              ]}
              onPress={handleReject}
            >
              <Text style={styles.btnText} numberOfLines={1} adjustsFontSizeToFit>
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
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 20,
    alignSelf: "center",
    marginVertical: 16,
    padding: 20,
    // depth
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
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
    backgroundColor: "rgba(0,0,0,0.05)",
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
  bottomBarVertical: {
    flexDirection: "column",
  },
  btnBase: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginHorizontal: 6,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  btnFullWidth: {
    maxWidth: "100%",
    marginHorizontal: 0,
    marginVertical: 6,
  },
  btnText: {
    fontWeight: "600",
    fontSize: 15,
    color: "#fff",
  },
});

