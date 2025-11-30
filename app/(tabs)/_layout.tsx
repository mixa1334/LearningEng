import {
  SAFE_AREA_MIN_BOTTOM,
  TAB_BAR_BASE_HEIGHT,
  TAB_BAR_BOTTOM_INSET_MULTIPLIER,
  TAB_BAR_HORIZONTAL_MARGIN,
} from "@/resources/constants/layout";
import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface IconProps {
  readonly color: string;
  readonly iconName: keyof typeof MaterialIcons.glyphMap;
}

function TabIcon({ color, iconName }: IconProps) {
  return <MaterialIcons name={iconName} size={24} color={color} />;
}

export default function TabLayout() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const bottomInset = Math.max(insets.bottom, SAFE_AREA_MIN_BOTTOM);
  const tabBarHeight = TAB_BAR_BASE_HEIGHT + bottomInset * TAB_BAR_BOTTOM_INSET_MULTIPLIER;
  const tabBarRadius = theme.roundness * 2;

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor:
            // Prefer elevated surface color when available (MD3)
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            (theme.colors as any).elevation?.level2 ?? theme.colors.surface,
          borderRadius: tabBarRadius,
          position: "absolute",
          marginHorizontal: TAB_BAR_HORIZONTAL_MARGIN,
          marginBottom: bottomInset,
          height: tabBarHeight,
          shadowColor: (theme.colors as any).shadow ?? "#000",
          shadowOpacity: 0.05,
          shadowRadius: 6,
          elevation: 3,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarLabelStyle: {
          fontWeight: "600",
          fontSize: 14,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="VocabularyTab"
        options={{
          title: "Vocabulary",
          tabBarIcon: ({ color }) => TabIcon({ color, iconName: "book" }),
        }}
      />
      <Tabs.Screen
        name="LearnTab"
        options={{
          title: "Learn",
          tabBarIcon: ({ color }) => TabIcon({ color, iconName: "school" }),
        }}
      />
      <Tabs.Screen
        name="ProfileTab"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => TabIcon({ color, iconName: "person" }),
        }}
      />
    </Tabs>
  );
}
