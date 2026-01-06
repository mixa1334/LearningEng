import { usePractice } from "@/src/hooks/usePractice";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { useAppTheme } from "../../../common/ThemeProvider";
import WordCard from "../../WordCard";
import { PracticeModeChildProps } from "../PracticeModeWrapper";

export default function WordsOverview(props: PracticeModeChildProps) {
  const theme = useAppTheme();

  const { words } = usePractice();

  const [acceptedCount, setAcceptedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [index, setIndex] = useState(0);

  const accept = () => {
    setAcceptedCount((prev) => prev + 1);
    updateIndex();
  };

  const reject = () => {
    setRejectedCount((prev) => prev + 1);
    updateIndex();
  };

  const generateEndMessage = (accepted: number, rejected: number): string => {
    const totalReviewed = accepted + rejected;
    let percentage = 0;
    if (totalReviewed !== 0) {
      percentage = Math.round((accepted / totalReviewed) * 100);
    }
    return `You remembered ${accepted} of ${totalReviewed} words (${percentage}%)`;
  };

  const endSession = () => props.onEndSession?.(generateEndMessage(acceptedCount, rejectedCount));


  //fix issue then react does not update the counters in time
  function updateIndex() {
    let newIndex = index + 1;
    if (newIndex === words.length) {
      newIndex = 0;
      props.onEndCurrentSet?.(generateEndMessage(acceptedCount + 1, rejectedCount + 1));
    }
    setIndex(newIndex);
  }

  return (
    <View style={styles.container}>
      <View style={styles.sessionContent}>
        <View
          style={[
            styles.progressCard,
            { backgroundColor: theme.colors.primary },
          ]}
        >
          <Text
            style={[styles.progressText, { color: theme.colors.onPrimary }]}
          >
            Known: {acceptedCount}
          </Text>
          <Text
            style={[styles.progressText, { color: theme.colors.onPrimary }]}
          >
            Unknown: {rejectedCount}
          </Text>
          <Button
            mode="contained-tonal"
            onPress={endSession}
            style={[styles.endBtn, { backgroundColor: theme.colors.reject }]}
            textColor={theme.colors.onAcceptReject}
            icon="flag-checkered"
          >
            End
          </Button>
        </View>
        <WordCard
          word={words[index]}
          accept={accept}
          acceptBtnName="Know"
          reject={reject}
          rejectBtnName="Don't know"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  topRowLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  resultText: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  sessionContent: {
    flex: 1,
  },
  progressCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  progressText: {
    fontSize: 14,
    fontWeight: "500",
  },
  reviewBtn: {
    marginTop: 12,
    borderRadius: 8,
  },
  endBtn: {
    borderRadius: 8,
  },
});
