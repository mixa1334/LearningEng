import { Word } from "@/model/entity/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "react-native-paper";

export default function WordCard({
  word,
  onKnow,
  onDontKnow,
}: {
  word: Word;
  onKnow: () => void;
  onDontKnow: () => void;
}) {
  const [showTranslation, setShowTranslation] = useState(false);
  const [pendingKnow, setPendingKnow] = useState(false);
  const theme = useTheme();
  useEffect(() => {
    setShowTranslation(false);
    setPendingKnow(false);
  }, [word]);

  const handleKnow = () => {
    if (!showTranslation) {
      setShowTranslation(true);
      setPendingKnow(true);
    } else {
      onKnow();
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.category, { color: theme.colors.onSurfaceVariant }]}>
        {word.category.icon} {word.category.name}
      </Text>
      <Text style={[styles.word, { color: theme.colors.onSurface }]}>
        {word.word_en} {word.transcription}
      </Text>

      {showTranslation ? (
        <Text style={[styles.translation, { color: theme.colors.primary }]}>
          {word.word_ru}
        </Text>
      ) : (
        <TouchableOpacity
          style={styles.eyeBtn}
          onPress={() => setShowTranslation(true)}
        >
          <Ionicons name="eye-outline" size={24} color={theme.colors.primary} />
          <Text style={[styles.eyeText, { color: theme.colors.primary }]}>
            Show translation
          </Text>
        </TouchableOpacity>
      )}

      <Text style={[styles.example, { color: theme.colors.onSurfaceVariant }]}>
        {word.text_example}
      </Text>

      <View style={styles.bottomBar}>
        {pendingKnow ? (
          <TouchableOpacity
            style={[styles.btnKnow, { backgroundColor: theme.colors.primary }]}
            onPress={handleKnow}
          >
            <Text style={styles.btnText}>Continue</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.btnKnow, { backgroundColor: theme.colors.primary }]}
              onPress={handleKnow}
            >
              <Text style={styles.btnText}>I know</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.btnDontKnow,
                { backgroundColor: theme.colors.error },
              ]}
              onPress={onDontKnow}
            >
              <Text style={styles.btnText}>I don’t know</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    elevation: 2,
    alignSelf: "center",
    maxWidth: "90%", 
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
    justifyContent: "center",
    paddingTop: 10,
  },
  btnKnow: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  btnDontKnow: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  btnText: { fontWeight: "600", fontSize: 16 },
});


