import { SPACING_XL } from "@/src/resources/constants/layout";
import { getDailyQuote, Quote } from "@/src/service/dailyQuoteService";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native"; // Added ActivityIndicator
import { IconButton, Text } from "react-native-paper";
import { getCardShadow } from "../common/cardShadow";
import { useAppTheme } from "../common/ThemeProvider";

export default function QuoteCard() {
  const theme = useAppTheme();
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
      const msg = error instanceof Error ? error.message : "Unable to load quote";
      console.error(msg);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    reloadQuote();
  }, [reloadQuote]);

  const renderContent = () => {
    if (isLoading && !quote) {
      return <ActivityIndicator color={theme.colors.onTertiary} style={styles.loader} />;
    }

    if (isError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={[styles.quote, { color: theme.colors.onTertiary }]}>Error loading quote</Text>
          <IconButton icon="refresh" onPress={reloadQuote} iconColor={theme.colors.onTertiary} />
        </View>
      );
    }

    if (!quote) return null;

    return (
      <>
        <Text style={[styles.label, { color: theme.colors.onTertiary }]}>Today&apos;s thought</Text>
        <Text selectable style={[styles.quote, { color: theme.colors.onTertiary }]}>
          “{quote.q}”
        </Text>
        <Text style={[styles.author, { color: theme.colors.onTertiary }]}>— {quote.a}</Text>
      </>
    );
  };

  return <View style={[styles.card, { backgroundColor: theme.colors.tertiary }, getCardShadow(theme)]}>{renderContent()}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    padding: SPACING_XL,
    marginBottom: SPACING_XL,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  quote: {
    fontSize: 18,
    fontWeight: "700",
    fontStyle: "italic",
    lineHeight: 26,
  },
  author: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: "500",
    textAlign: "right",
  },
  loader: {
    marginVertical: 20,
  },
  errorContainer: {
    marginVertical: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
});
