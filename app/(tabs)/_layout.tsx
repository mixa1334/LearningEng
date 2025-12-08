import {
  SAFE_AREA_MIN_BOTTOM,
  TAB_BAR_BASE_HEIGHT,
  TAB_BAR_BOTTOM_INSET_MULTIPLIER,
  TAB_BAR_HORIZONTAL_MARGIN,
} from "@/resources/constants/layout";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface IconProps {
  readonly color: string;
  readonly iconName: keyof typeof MaterialIcons.glyphMap;
  readonly focused: boolean;
}

function TabIcon({ color, iconName, focused }: IconProps) {
  const theme = useTheme();

  const activeBackgroundColor =
    (theme.colors as any).secondaryContainer ??
    (theme.colors as any).elevation?.level2 ??
    theme.colors.surface;
  const activeIconColor =
    (theme.colors as any).onSecondaryContainer ?? theme.colors.primary;

  const size = 30;

  if (focused) {
    return (
      <View
        style={{
          borderRadius: 999,
          backgroundColor: activeBackgroundColor,
        }}
      >
        <MaterialIcons name={iconName} size={size} color={activeIconColor} />
      </View>
    );
  }

  return <MaterialIcons name={iconName} size={30} color={color} />;
}

export default function TabLayout() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const bottomInset = Math.max(insets.bottom, SAFE_AREA_MIN_BOTTOM);
  const tabBarHeight =
    TAB_BAR_BASE_HEIGHT + bottomInset * TAB_BAR_BOTTOM_INSET_MULTIPLIER;
  const tabBarRadius = tabBarHeight / 2;

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "transparent",
          borderRadius: tabBarRadius,
          position: "absolute",
          marginHorizontal: TAB_BAR_HORIZONTAL_MARGIN * 1.5,
          marginBottom: bottomInset,
          height: tabBarHeight,
          shadowColor: (theme.colors as any).shadow ?? "#000",
          shadowOpacity: 0.05,
          shadowRadius: 6,
          elevation: 3,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={50}
            tint={theme.dark ? "dark" : "light"}
            style={{ flex: 1, borderRadius: tabBarRadius, overflow: "hidden" }}
          />
        ),
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="VocabularyTab"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} iconName="book" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="LearnTab"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} iconName="school" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="ProfileTab"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} iconName="person" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
