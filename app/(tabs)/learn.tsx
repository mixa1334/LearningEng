import WordScreen from "@/components/WordScreen";
import { useLoadDailySet, useMarkWordReviewed, useStartLearnWord } from "@/hooks/useWords";
import React, { useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

enum ActiveLearningTab {
  learn = "learn_tab",
  review = "review_tab",
}

export default function LearnTab() {
  const [activeTab, setActiveTab] = useState<ActiveLearningTab>(
    ActiveLearningTab.review
  );
  const fadeAnim = useState(new Animated.Value(1))[0];
  const { wordsToReview, wordsToLearn, status, error, reload } = useLoadDailySet();
  const markWordReviewed = useMarkWordReviewed();
  const startLearnWord = useStartLearnWord();

  const switchTab = (tab: ActiveLearningTab) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setActiveTab(tab));
  };

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
    <View style={{ flex: 1 }}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={[
            styles.topBtn,
            activeTab === ActiveLearningTab.learn && styles.activeBtn,
          ]}
          onPress={() => switchTab(ActiveLearningTab.learn)}
        >
          <Text style={styles.topBtnText}>Learn</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.topBtn,
            activeTab === ActiveLearningTab.review && styles.activeBtn,
          ]}
          onPress={() => switchTab(ActiveLearningTab.review)}
        >
          <Text style={styles.topBtnText}>Review</Text>
        </TouchableOpacity>
      </View>

      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {activeTab === ActiveLearningTab.learn ? (
          <WordScreen words={wordsToLearn} learnedCallback={startLearnWord}/>
        ) : (
          <WordScreen words={wordsToReview} learnedCallback={markWordReviewed} />
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
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
