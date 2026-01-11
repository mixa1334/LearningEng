import type { ViewStyle } from "react-native";
import { AppTheme } from "./ThemeProvider";

export function getCardShadow(theme: AppTheme): ViewStyle {
  const isDark = theme.dark;

  return {
    shadowColor: isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.6)",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  };
}
