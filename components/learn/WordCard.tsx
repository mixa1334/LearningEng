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

  // useEffect(() => {
  //   setShowTranslation(false);
  //   setPending(false);
  //   setAccepted(false);
  // }, [word]);

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
          <Ionicons name="eye-outline" size={24} color={theme.colors.primary} />
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
              styles.btnAccept,
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
                styles.btnAccept,
                isNarrow && styles.btnFullWidth,
                { backgroundColor: acceptColor },
              ]}
              onPress={handleAccept}
            >
              <Text
                style={styles.btnText}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {acceptBtnName}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.btnReject,
                isNarrow && styles.btnFullWidth,
                { backgroundColor: theme.colors.error },
              ]}
              onPress={handleReject}
            >
              <Text
                style={styles.btnText}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
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
    justifyContent: "center",
    borderRadius: 24,
    borderWidth: 0,
    borderColor: "transparent",
    alignSelf: "center",
    marginVertical: 16,
  },
  category: { fontWeight: "600", marginBottom: 6 },
  word: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 6,
    textAlign: "center",
  },
  translation: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  example: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
  },
  eyeBtn: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  eyeText: { marginLeft: 6, fontWeight: "600" },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingTop: 10,
  },
  bottomBarVertical: {
    flexDirection: "column",
  },
  btnAccept: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },
  btnReject: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },
  btnFullWidth: {
    maxWidth: "100%",
    marginHorizontal: 0,
    marginVertical: 4,
  },
  btnText: { fontWeight: "600", fontSize: 13 },
});
