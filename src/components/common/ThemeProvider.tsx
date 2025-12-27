import { THEMES } from "@/src/model/entity/types";
import { getUserTheme, setUserTheme } from "@/src/model/service/userDataService";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { readonly children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    (async () => {
      const value = await getUserTheme();
      if (value === THEMES.DARK) setIsDark(true);
    })();
  }, []);

  const toggleTheme = useCallback(
    async () => {
      const newValue = !isDark;
      setIsDark(newValue);
      await setUserTheme(newValue ? THEMES.DARK : THEMES.LIGHT);
    },
    [isDark],
  );

  const theme = isDark ? MD3DarkTheme : MD3LightTheme;

  const contextValue = useMemo(
    () => ({
      isDark,
      toggleTheme,
    }),
    [isDark, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
}
