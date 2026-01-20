import { THEMES } from "@/src/entity/types";
import { getUserTheme, setUserTheme } from "@/src/service/userDataService";
import * as Storage from "expo-sqlite/kv-store";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { MD3DarkTheme, MD3LightTheme, PaperProvider, useTheme } from "react-native-paper";

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    accept: "#4CAF50",
    reject: "#D32F2F",
    onAcceptReject: "#FFFFFF",
    text: "#FFFFFF",
    shadow: "0 0 10px 0 rgba(0, 0, 0, 0.2)",
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    accept: "#2E7D32",
    reject: "#B00020",
    onAcceptReject: "#FFFFFF",
    text: "#000000",
    shadow: "0 0 10px 0 rgba(255, 255, 255, 0.2)",
  },
};

const hihikDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#FF5C6B",
    onPrimary: "#1A0004",
    primaryContainer: "#55000F",
    onPrimaryContainer: "#FFE6EA",

    secondary: "#FF6B81",
    onSecondary: "#200008",
    secondaryContainer: "#3A000E",
    onSecondaryContainer: "#FFD6DF",

    tertiary: "#FF8FA3",
    onTertiary: "#24000A",
    tertiaryContainer: "#420012",
    onTertiaryContainer: "#FFE0E7",

    background: "#080103",
    onBackground: "#FFE6EA",

    surface: "#1B0509",
    onSurface: "#FFD6DF",
    surfaceVariant: "#341018",
    onSurfaceVariant: "#FFBECF",

    outline: "#FF9FB1",
    outlineVariant: "#7F4E5A",

    error: "#FF4B5C",
    onError: "#1A0004",

    accept: "#FF6B81",
    reject: "#FF4B5C",
    onAcceptReject: "#FFFFFF",
    text: "#FFD6DF",
    shadow: "0 0 18px 0 rgba(255, 75, 92, 0.45)",
  },
};

const hihikLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#FF5C6B",
    onPrimary: "#FFFFFF",
    primaryContainer: "#FFE6EA",
    onPrimaryContainer: "#3A0010",

    secondary: "#FF6B81",
    onSecondary: "#FFFFFF",
    secondaryContainer: "#FFD6DF",
    onSecondaryContainer: "#3A0010",

    tertiary: "#FF8FA3",
    onTertiary: "#FFFFFF",
    tertiaryContainer: "#FFE0E7",
    onTertiaryContainer: "#3A0010",

    background: "#FFF8F9",
    onBackground: "#1F0006",

    surface: "#FFEDEF",
    onSurface: "#1F0006",
    surfaceVariant: "#FFD6DF",
    onSurfaceVariant: "#3A0010",

    outline: "#C73F50",
    outlineVariant: "#F49AA9",

    error: "#FF4B5C",
    onError: "#FFFFFF",

    accept: "#FF6B81",
    reject: "#FF4B5C",
    onAcceptReject: "#FFFFFF",
    text: "#3A0010",
    shadow: "0 0 18px 0 rgba(255, 92, 107, 0.35)",
  },
};

export type AppTheme = typeof lightTheme;

export const useAppTheme = () => useTheme<AppTheme>();

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
  isHihik: boolean;
  toggleHihikTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => { },
  isHihik: false,
  toggleHihikTheme: () => { },
});

export const useThemeContext = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { readonly children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [isHihik, setIsHihik] = useState(false);

  useEffect(() => {
    (async () => {
      const value = await getUserTheme();
      if (value === THEMES.DARK) setIsDark(true);
      const hihikValue = await Storage.AsyncStorage.getItemAsync("isHihik");
      if (hihikValue === "true") setIsHihik(true);
    })();
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const newIsDark = !prev;
      setUserTheme(newIsDark ? THEMES.DARK : THEMES.LIGHT);
      return newIsDark;
    });
  }, []);

  const toggleHihikTheme = useCallback(() => {
    setIsHihik((prev) => {
      const newIsHihik = !prev;
      Storage.AsyncStorage.setItemAsync("isHihik", newIsHihik.toString());
      return newIsHihik;
    });
  }, []);

  let theme = isDark ? darkTheme : lightTheme;
  if (isHihik) {
    theme = isDark ? hihikDarkTheme : hihikLightTheme;
  }

  const contextValue = useMemo(
    () => ({
      isDark,
      toggleTheme,
      isHihik,
      toggleHihikTheme,
    }),
    [isDark, toggleTheme, toggleHihikTheme, isHihik]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
}
