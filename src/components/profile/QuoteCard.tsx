import { SPACING_XL } from "@/src/resources/constants/layout";
import { getDailyQuote, Quote } from "@/src/service/dailyQuoteService";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import Animated, { FadeInDown } from "react-native-reanimated";

import { getCardShadow } from "../common/cardShadow";
import { useLanguageContext } from "../common/LanguageProvider";
import { LoadingContentSpinner } from "../common/LoadingContentSpinner";
import { useAppTheme } from "../common/ThemeProvider";
import { MaterialIcons } from "@expo/vector-icons";

export default function QuoteCard() {
  const theme = useAppTheme();
  const { text } = useLanguageContext();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const reloadQuote = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await getDailyQuote();
      setQuote(data);
    } catch (error) {
      const msg = error instanceof Error ? error.message : text("profile_quote_error_generic");
      console.error(msg);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [text]);

  useEffect(() => {
    reloadQuote();
  }, [reloadQuote]);

  const renderContent = () => {
    if (isLoading && !quote) {
      return <LoadingContentSpinner />;
    }

    if (isError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={[styles.quote, { color: theme.colors.onTertiary }]}>{text("profile_quote_error_title")}</Text>
          <IconButton icon="refresh" onPress={reloadQuote} iconColor={theme.colors.onTertiary} />
        </View>
      );
    }

    if (!quote) return null;

    return (
      <View>
        <View style={styles.header}>
             <MaterialIcons name="format-quote" size={24} color={theme.colors.onTertiary} style={{ opacity: 0.6 }} />
             <Text style={[styles.label, { color: theme.colors.onTertiary }]}>{text("profile_quote_today_label")}</Text>
        </View>
        <Text selectable style={[styles.quote, { color: theme.colors.onTertiary }]}>
          {quote.q}
        </Text>
        <Text style={[styles.author, { color: theme.colors.onTertiary }]}>— {quote.a}</Text>
      </View>
    );
  };

  return (
    <Animated.View 
        entering={FadeInDown.delay(300).springify()}
        style={[styles.card, { backgroundColor: theme.colors.tertiary }, getCardShadow(theme)]}
    >
        {renderContent()}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: SPACING_XL,
    marginBottom: SPACING_XL,
    minHeight: 150,
    justifyContent: "center",
  },
  header: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    opacity: 0.8,
  },
  quote: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 28,
    fontStyle: "italic",
    marginBottom: 16,
  },
  author: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "right",
    opacity: 0.9,
  },
  errorContainer: {
    alignItems: "center",
    gap: 8,
  },
});
