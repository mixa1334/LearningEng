import { useMarkWordLearned, useWordsDueToday } from "@/hooks/useWords";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function LearnTab() {
  const { items, status, error, reload } = useWordsDueToday();
  const markLearned = useMarkWordLearned();

  if (status === "loading") {
    return (
      <View style={styles.center}>
        <Text>Loading words...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>Error: {error}</Text>
        <TouchableOpacity onPress={reload}>
          <Text>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(w) => String(w.id)}
      contentContainerStyle={{ padding: 16 }}
      ListEmptyComponent={<Text>No words due right now.</Text>}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.category}>
            {item.category.icon} {item.category.name}
          </Text>
          <Text style={styles.word}>
            {item.word_en} — {item.word_ru}{" "}
            <Text style={styles.trans}>{item.transcription}</Text>
          </Text>
          <Text style={styles.example}>{item.text_example}</Text>
          <View style={styles.row}>
            <Text style={styles.meta}>Priority: {item.priority}</Text>
            <Text style={styles.meta}>
              Next review: {new Date(item.next_review).toLocaleDateString()}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => markLearned(item.id)}
          >
            <Text style={styles.btnText}>Mark learned</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  category: { fontWeight: "600", color: "#666", marginBottom: 6 },
  word: { fontSize: 18, fontWeight: "700", marginBottom: 6 },
  trans: { fontSize: 14, color: "#777" },
  example: { fontSize: 14, color: "#444", marginBottom: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  meta: { fontSize: 12, color: "#666" },
  btn: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "600" },
});
