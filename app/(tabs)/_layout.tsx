import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

function VocabularyIcon({ color }: { color: string }) {
  return <MaterialIcons name="book" size={24} color={color} />;
}

function LearnIcon({ color }: { color: string }) {
  return <MaterialIcons name="school" size={24} color={color} />;
}

function ProfileIcon({ color }: { color: string }) {
  return <MaterialIcons name="person" size={24} color={color} />;
}

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="vocabulary"
        options={{
          title: "Vocabulary",
          tabBarIcon: VocabularyIcon,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: "Learn",
          tabBarIcon: LearnIcon,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ProfileIcon,
        }}
      />
    </Tabs>
  );
}
