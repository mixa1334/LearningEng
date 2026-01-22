import { Platform, type ViewStyle } from "react-native";
import { AppTheme } from "./ThemeProvider";

export function getCardShadow(theme: AppTheme): ViewStyle {
  const isDark = theme.dark;

  if (Platform.OS === "android") {
    return {
      elevation: 6,
    };
  }

  return {
    shadowColor: isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.45)",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  };
}
