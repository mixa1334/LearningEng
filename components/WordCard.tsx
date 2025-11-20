import { Word } from "@/model/entity/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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

  const handleKnow = () => {
    if (!showTranslation) {
      setShowTranslation(true);
      setPendingKnow(true);
    } else {
      onKnow();
    }
  };

  const handleContinue = () => {
    setPendingKnow(false);
    onKnow();
  };

  return (
    <View style={styles.card}>
      <Text style={styles.category}>
        {word.category.icon} {word.category.name}
      </Text>
      <Text style={styles.word}>
        {word.word_en} {word.transcription}
      </Text>

      {showTranslation ? (
        <Text style={styles.translation}>{word.word_ru}</Text>
      ) : (
        <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowTranslation(true)}>
          <Ionicons name="eye-outline" size={24} color="#007AFF" />
          <Text style={styles.eyeText}>Show translation</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.example}>{word.text_example}</Text>

      <View style={styles.bottomBar}>
        {pendingKnow ? (
          <TouchableOpacity style={styles.btnKnow} onPress={handleContinue}>
            <Text style={styles.btnText}>Continue</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity style={styles.btnKnow} onPress={handleKnow}>
              <Text style={styles.btnText}>I know</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnDontKnow} onPress={onDontKnow}>
              <Text style={styles.btnText}>I don’t know</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 20, alignItems: "center" },
  category: { fontWeight: "600", color: "#666", marginBottom: 6 },
  word: { fontSize: 22, fontWeight: "700", marginBottom: 6 },
  translation: { fontSize: 20, color: "#007AFF", marginBottom: 10 },
  example: { fontSize: 14, color: "#444", marginBottom: 20, textAlign: "center" },
  eyeBtn: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  eyeText: { marginLeft: 6, color: "#007AFF", fontWeight: "600" },
  bottomBar: { flexDirection: "row", justifyContent: "center", width: "100%", padding: 20 },
  btnKnow: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  btnDontKnow: {
    backgroundColor: "#F44336",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});