import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

interface IconProps {
  readonly color: string;
  readonly iconName: keyof typeof MaterialIcons.glyphMap;
}

function TabIcon({ color, iconName }: IconProps) {
  return <MaterialIcons name={iconName} size={24} color={color} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#cdafebff",
          borderRadius: 16,
          position: "absolute",
          marginHorizontal: 16,
          marginBottom: 30,
          height: 70,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 6,
          elevation: 3,
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#333",
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
