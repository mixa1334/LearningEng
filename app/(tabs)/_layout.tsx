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
  theme.colors.secondaryContainer ??theme.colors.elevation?.level2 ??
    theme.colors.surface;
  const inactiveBackgroundColor =
    theme.dark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255, 0.5)";
  const activeIconColor =
  theme.colors.onSecondaryContainer ?? theme.colors.primary;
  const inactiveIconColor = color;

  const iconSize = 24;
  const containerSize = 40; // fixed circle size

  return (
    <View
      style={{
        width: containerSize,
        height: containerSize,
        borderRadius: containerSize / 2,
        backgroundColor: focused ? activeBackgroundColor : inactiveBackgroundColor,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <MaterialIcons
        name={iconName}
        size={iconSize}
        color={focused ? activeIconColor : inactiveIconColor}
      />
    </View>
  );
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
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          alignContent: "center",
          backgroundColor: "transparent",
          borderRadius: tabBarRadius,
          borderTopWidth: 0,
          position: "absolute",
          marginHorizontal: TAB_BAR_HORIZONTAL_MARGIN * 3,
          marginBottom: bottomInset,
          height: tabBarHeight,
          shadowColor: (theme.colors as any).shadow ?? "#000",
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 4,
        },
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center", // ensures icons are centered vertically
        },
        tabBarBackground: () => (
          <BlurView
            intensity={50}
            tint={theme.dark ? "light" : "dark"} // invert tint for contrast
            style={{
              flex: 1,
              borderRadius: tabBarRadius,
              overflow: "hidden",
              backgroundColor:"rgba(0, 0, 0, 0)",
            }}
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


