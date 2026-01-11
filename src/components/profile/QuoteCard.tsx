import { SPACING_XL } from "@/src/resources/constants/layout";
import { getDailyQuote, Quote } from "@/src/service/dailyQuoteService";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { getCardShadow } from "../common/cardShadow";
import { useAppTheme } from "../common/ThemeProvider";

const DEFAULT_QUOTE: Quote = {
  q: "loading...",
  a: "loading...",
  h: "loading...",
};

export default function QuoteCard() {
  const theme = useAppTheme();
  const [quote, setQuote] = useState<Quote>(DEFAULT_QUOTE);

  useEffect(() => {
    getDailyQuote().then((quote) => {
      setQuote(quote);
    });
  }, []);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.tertiary,
        },
        getCardShadow(theme),
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: theme.colors.onTertiary,
          },
        ]}
      >
        Today&apos;s thought
      </Text>

      <Text
        style={[
          styles.quote,
          {
            color: theme.colors.onTertiary,
          },
        ]}
      >
        “{quote.q}”
      </Text>

      <Text
        style={[
          styles.author,
          {
            color: theme.colors.onTertiary,
          },
        ]}
      >
        — {quote.a}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    paddingVertical: SPACING_XL,
    paddingHorizontal: SPACING_XL,
    marginBottom: SPACING_XL,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    opacity: 0.9,
    textTransform: "uppercase",
    marginBottom: 8,
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
    opacity: 0.9,
  },
});
