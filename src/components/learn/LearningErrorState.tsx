import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { useLanguageContext } from "../common/LanguageProvider";
import { useAppTheme } from "../common/ThemeProvider";
import { getCardShadow } from "../common/cardShadow";
import { MaterialIcons } from "@expo/vector-icons";

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
      <Animated.View
        entering={FadeInDown.springify()}
        style={[
          styles.card,
          { backgroundColor: theme.colors.surface },
          getCardShadow(theme),
        ]}
      >
        <View style={styles.content}>
          <MaterialIcons name="error-outline" size={48} color={theme.colors.error} style={{ marginBottom: 16 }} />
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {text("learn_error_message", { error })}
          </Text>
          <TouchableOpacity 
            onPress={onRetry}
            style={[styles.retryButton, { backgroundColor: theme.colors.errorContainer }]}
          >
            <Text style={[styles.retryText, { color: theme.colors.onErrorContainer }]}>
              {text("learn_retry_button")}
            </Text>
            <MaterialIcons name="refresh" size={20} color={theme.colors.onErrorContainer} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    borderRadius: 24,
  },
  content: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  errorText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  retryText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
