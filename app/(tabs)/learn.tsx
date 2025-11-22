import WordScreen from "@/components/WordScreen";
import {
  useLearnWordCompletely,
  useLoadDailySet,
  useLoopWordInReview,
  useMarkWordReviewed,
  useStartLearnWord,
} from "@/hooks/useWords";
import React, { useState } from "react";
import {
  RefreshControl,
  ScrollView,
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
    ActiveLearningTab.learn
  );
  const { wordsToReview, wordsToLearn, status, error, reload } =
    useLoadDailySet();

  const markWordReviewed = useMarkWordReviewed();
  const startLearnWord = useStartLearnWord();
  const markWordCompleted = useLearnWordCompletely();
  const rotateWordInReview = useLoopWordInReview();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      reload();
      setRefreshing(false);
    }, 200);
  };

  if (status === "loading") {
    return (
      <View style={styles.page}>
        <View style={styles.card}>
          <View style={styles.fullCenter}>
            <Text>Loading words...</Text>
          </View>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.page}>
        <View style={styles.card}>
          <View style={styles.fullCenter}>
            <Text style={{ color: "red", marginBottom: 12 }}>
              Error: {error}
            </Text>
            <TouchableOpacity onPress={reload}>
              <Text style={{ color: "#007AFF", fontWeight: "600" }}>Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.page}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.card}>
        {/* Tab strip */}
        <View style={styles.tabButtons}>
          <TouchableOpacity
            style={[
              styles.topBtn,
              activeTab === ActiveLearningTab.learn && styles.activeBtn,
            ]}
            onPress={() => setActiveTab(ActiveLearningTab.learn)}
          >
            <Text style={styles.topBtnText}>Learn</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.topBtn,
              activeTab === ActiveLearningTab.review && styles.activeBtn,
            ]}
            onPress={() => setActiveTab(ActiveLearningTab.review)}
          >
            <Text style={styles.topBtnText}>Review</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {activeTab === ActiveLearningTab.learn ? (
            <WordScreen
              words={wordsToLearn}
              accept={markWordCompleted}
              reject={startLearnWord}
            />
          ) : (
            <WordScreen
              words={wordsToReview}
              accept={markWordReviewed}
              reject={rotateWordInReview}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: "5%",
    paddingVertical: "5%",
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    overflow: "hidden",
  },
  tabButtons: {
    flexDirection: "row",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#f5f5f5",
  },
  topBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeBtn: {
    borderBottomColor: "#007AFF",
    backgroundColor: "#fff",
  },
  topBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: "5%",
  },
  fullCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: "5%",
  },
});
