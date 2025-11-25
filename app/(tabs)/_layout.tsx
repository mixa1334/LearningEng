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
          tabBarIcon: VocabularyIcon,
        }}
      />
      <Tabs.Screen
        name="LearnTab"
        options={{
          title: "Learn",
          tabBarIcon: LearnIcon,
        }}
      />
      <Tabs.Screen
        name="ProfileTab"
        options={{
          title: "Profile",
          tabBarIcon: ProfileIcon,
        }}
      />
    </Tabs>
  );
}

