import { THEMES } from "@/src/entity/types";
import { getUserTheme, setUserTheme } from "@/src/service/userDataService";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  useTheme,
} from "react-native-paper";

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

export type AppTheme = typeof lightTheme;

export const useAppTheme = () => useTheme<AppTheme>();

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export function ThemeProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    (async () => {
      const value = await getUserTheme();
      if (value === THEMES.DARK) setIsDark(true);
    })();
  }, []);

  const toggleTheme = useCallback(async () => {
    const newValue = !isDark;
    setIsDark(newValue);
    await setUserTheme(newValue ? THEMES.DARK : THEMES.LIGHT);
  }, [isDark]);

  const theme = isDark ? darkTheme : lightTheme;

  const contextValue = useMemo(
    () => ({
      isDark,
      toggleTheme,
    }),
    [isDark, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
}
