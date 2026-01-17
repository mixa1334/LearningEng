import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useLanguageContext } from "../common/LanguageProvider";
import { useAppTheme } from "../common/ThemeProvider";
import { getCardShadow } from "../common/cardShadow";

interface LearningErrorStateProps {
  readonly error: string;
  readonly onRetry: () => void;
}

export default function LearningErrorState({
  error,
  onRetry,
}: LearningErrorStateProps) {
  const theme = useAppTheme();
  const { text } = useLanguageContext();

  return (
    <View style={[styles.page, { backgroundColor: theme.colors.background }]}>
      <View
        style={[
          styles.card,
          { backgroundColor: theme.colors.surface },
          getCardShadow(theme),
        ]}
      >
        <View style={styles.content}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {text("learn_error_message", { error })}
          </Text>
          <TouchableOpacity onPress={onRetry}>
            <Text style={[styles.retryText, { color: theme.colors.primary }]}>
              {text("learn_retry_button")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 12,
    overflow: "hidden",
  },
  content: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
  },
  retryText: {
    fontSize: 14,
    fontWeight: "600",
  },
});


