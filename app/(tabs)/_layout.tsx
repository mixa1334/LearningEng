import {
  SAFE_AREA_MIN_BOTTOM,
  TAB_BAR_BASE_HEIGHT,
  TAB_BAR_BOTTOM_INSET_MULTIPLIER,
  TAB_BAR_HORIZONTAL_MARGIN,
} from "@/src/resources/constants/layout";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface IconProps { 
  readonly iconName: keyof typeof MaterialIcons.glyphMap;
  readonly focused: boolean;
}

function TabIcon({ iconName, focused }: IconProps) {
  const theme = useTheme();

  const backgroundColor = focused ? theme.colors.background : theme.colors.onBackground;
  const iconColor = focused ? theme.colors.onBackground : theme.colors.background;

  const iconSize = 24;
  const containerSize = 40;

  return (
    <View
      style={{
        width: containerSize,
        height: containerSize,
        borderRadius: containerSize / 2,
        backgroundColor: backgroundColor,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <MaterialIcons
        name={iconName}
        size={iconSize}
        color={iconColor}
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
          borderTopWidth: 0,
          borderTopColor: "transparent",
          position: "absolute",
          backgroundColor: "transparent",
          marginHorizontal: TAB_BAR_HORIZONTAL_MARGIN * 3,
          marginBottom: bottomInset,
          height: tabBarHeight,
          elevation: 0,
          shadowColor: "transparent",
        },
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarBackground: () => (
          <BlurView
            intensity={50}
            tint={theme.dark ? "light" : "dark"}
            style={{
              flex: 1,
              borderRadius: tabBarRadius,
              overflow: "hidden",
              backgroundColor: "rgba(0, 0, 0, 0.25)",
            }}
          />
        ),
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarShowLabel: false,
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.onPrimary,
      }}
    >
      <Tabs.Screen
        name="VocabularyTab"
        options={{
          title: "Vocabulary",
          tabBarIcon: ({ focused }) => (
            <TabIcon iconName="book" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="LearnTab"
        options={{
          title: "Learn & Review Words",
          tabBarIcon: ({ focused }) => (
            <TabIcon iconName="school" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="ProfileTab"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabIcon iconName="person" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
