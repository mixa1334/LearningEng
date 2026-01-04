import { useAppTheme } from "@/src/components/common/ThemeProvider";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface IconProps {
  readonly iconName: keyof typeof MaterialIcons.glyphMap;
  readonly focused: boolean;
}

function TabIcon({ iconName, focused }: IconProps) {
  const theme = useAppTheme();

  const backgroundColor = focused
    ? theme.colors.primary
    : theme.colors.primaryContainer;
  const iconColor = focused
    ? theme.colors.onPrimary
    : theme.colors.onPrimaryContainer;

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
      <MaterialIcons name={iconName} size={iconSize} color={iconColor} />
    </View>
  );
}

export default function TabLayout() {
  const theme = useAppTheme();
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
          position: "absolute",
          marginHorizontal: TAB_BAR_HORIZONTAL_MARGIN * 3,
          marginBottom: bottomInset,
          height: tabBarHeight,
          elevation: 0,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={70}
            tint={theme.dark ? "systemUltraThinMaterialDark" : "systemUltraThinMaterialLight"}
            style={{
              flex: 1,
              borderRadius: tabBarRadius,
              boxShadow: theme.colors.shadow,
              overflow: "hidden",
            }}
          />
        ),
        headerShown: false,
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
