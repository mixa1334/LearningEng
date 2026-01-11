import { useAppTheme } from "@/src/components/common/ThemeProvider";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Tabs } from "expo-router";
import React from "react";
import { GestureResponderEvent, Pressable, View } from "react-native";

interface IconProps {
  readonly iconName: keyof typeof MaterialIcons.glyphMap;
  readonly focused: boolean;
}

function CustomTabBarButton(props: BottomTabBarButtonProps) {
  const handlePress = (event: GestureResponderEvent) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    props.onPress?.(event);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        props.style,
        {
          opacity: pressed ? 0.7 : 1,
          transform: [{ scale: pressed ? 0.95 : 1 }],
        },
      ]}
    >
      {props.children}
    </Pressable>
  );
}

function TabIcon({ iconName, focused }: IconProps) {
  const theme = useAppTheme();

  const backgroundColor = focused ? theme.colors.onBackground : theme.colors.background;
  const iconColor = focused ? theme.colors.background : theme.colors.onBackground;

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
      initialRouteName="index"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          display: "flex",
          flexDirection: "row",
          paddingTop: 10,
          borderTopWidth: 0,
          position: "absolute",
        },
        tabBarBackground: () => (
          <BlurView
            intensity={100}
            tint={theme.dark ? "systemUltraThinMaterialDark" : "systemUltraThinMaterialLight"}
            style={{
              flex: 1,
            }}
          />
        ),
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="vocabulary"
        options={{
          title: "Vocabulary",
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
          tabBarIcon: ({ focused }) => <TabIcon iconName="book" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Learn & Review Words",
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
          tabBarIcon: ({ focused }) => <TabIcon iconName="school" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
          tabBarIcon: ({ focused }) => <TabIcon iconName="person" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
