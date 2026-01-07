import { useAppTheme } from "@/src/components/common/ThemeProvider";
import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";

interface IconProps {
  readonly iconName: keyof typeof MaterialIcons.glyphMap;
  readonly focused: boolean;
}

function TabIcon({ iconName, focused }: IconProps) {
  const theme = useAppTheme();

  const backgroundColor = focused
    ? theme.colors.onBackground
    : theme.colors.surfaceVariant;
  const iconColor = focused
    ? theme.colors.background
    : theme.colors.onBackground;

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

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          paddingTop: 10,
          borderTopWidth: 0,
          position: "absolute",
          elevation: 0,
          backgroundColor: theme.colors.surfaceVariant,
        },
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
