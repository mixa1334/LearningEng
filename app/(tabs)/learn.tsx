import WordScreen from "@/components/WordScreen";
import { Category, Word } from "@/model/entity/types";
import React, { useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Example categories + words (replace with SQLite fetch later)
const categories: Category[] = [
  { id: 1, name: "Nature", type: "pre_loaded", icon: "🌿" },
  { id: 2, name: "Food", type: "pre_loaded", icon: "🍎" },
];

const learnWords: Word[] = [
  {
    id: 1,
    word_en: "river",
    word_ru: "река",
    transcription: "[ˈrɪvər]",
    type: "pre_loaded",
    learned: false,
    category: categories[0],
    next_review: new Date().toISOString(),
    priority: 0,
    text_example: "The river flows through the valley.",
  },
  {
    id: 2,
    word_en: "apple",
    word_ru: "яблоко",
    transcription: "[ˈæpəl]",
    type: "pre_loaded",
    learned: false,
    category: categories[1],
    next_review: new Date().toISOString(),
    priority: 0,
    text_example: "She ate a red apple.",
  },
];

const reviewWords: Word[] = [
  {
    id: 3,
    word_en: "mountain",
    word_ru: "гора",
    transcription: "[ˈmaʊntən]",
    type: "pre_loaded",
    learned: false,
    category: categories[0],
    next_review: new Date().toISOString(),
    priority: 1,
    text_example: "We climbed a high mountain.",
  },
  {
    id: 4,
    word_en: "bread",
    word_ru: "хлеб",
    transcription: "[brɛd]",
    type: "pre_loaded",
    learned: false,
    category: categories[1],
    next_review: new Date().toISOString(),
    priority: 1,
    text_example: "Fresh bread smells amazing.",
  },
  {
    id: 5,
    word_en: "forest",
    word_ru: "лес",
    transcription: "[ˈfɒrɪst]",
    type: "pre_loaded",
    learned: false,
    category: categories[0],
    next_review: new Date().toISOString(),
    priority: 1,
    text_example: "The forest is quiet at dawn.",
  },
];

export default function LearnTab() {
  const [activeTab, setActiveTab] = useState<"learn" | "review">("learn");
  const fadeAnim = useState(new Animated.Value(1))[0];

  const switchTab = (tab: "learn" | "review") => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start(() => setActiveTab(tab));
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Top buttons */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={[styles.topBtn, activeTab === "learn" && styles.activeBtn]}
          onPress={() => switchTab("learn")}
        >
          <Text style={styles.topBtnText}>Learn</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.topBtn, activeTab === "review" && styles.activeBtn]}
          onPress={() => switchTab("review")}
        >
          <Text style={styles.topBtnText}>Review</Text>
        </TouchableOpacity>
      </View>

      {/* Animated screen switch */}
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {activeTab === "learn" ? (
          <WordScreen words={learnWords} />
        ) : (
          <WordScreen words={reviewWords} />
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 20,
    backgroundColor: "#f0f0f0",
    gap: 20,
  },
  topBtn: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    backgroundColor: "#ddd",
  },
  activeBtn: { backgroundColor: "#007AFF" },
  topBtnText: { color: "#000", fontWeight: "700", fontSize: 18 },
});
