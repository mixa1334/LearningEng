import { useAutoScroll } from "@/src/components/common/AutoScrollContext";
import {
  SPACING_MD,
  SPACING_XXL,
  TAB_BAR_BASE_HEIGHT,
} from "@/src/resources/constants/layout";
import { BlurView } from "expo-blur";
import React from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "./ThemeProvider";

interface AnimatedAutoScrollViewProps {
  readonly children: React.ReactNode;
  readonly headerTitle?: string;
}

export default function AnimatedAutoScrollView({
  children,
  headerTitle,
}: AnimatedAutoScrollViewProps) {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const { scrollViewRef } = useAutoScroll();

  const HEADER_HEIGHT = insets.top + SPACING_XXL;
  const contentHorizontalPadding = SPACING_MD;
  const contentTopPadding = insets.top * 1.5;
  const contentBottomPadding =
    insets.bottom + SPACING_XXL + TAB_BAR_BASE_HEIGHT;

  const scrollY = React.useRef(new Animated.Value(0)).current;

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT * 0.5],
    outputRange: [-HEADER_HEIGHT, 0],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT * 0.5],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: HEADER_HEIGHT,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: SPACING_MD,
          paddingTop: insets.top,
          transform: [{ translateY: headerTranslateY }],
          opacity: headerOpacity,
          zIndex: 10,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.onBackground,
        }}
      >
        <BlurView
          intensity={70}
          tint={
            theme.dark
              ? "systemUltraThinMaterialDark"
              : "systemUltraThinMaterialLight"
          }
          style={StyleSheet.absoluteFill}
        />
        <Text
          style={{
            color: theme.colors.onBackground,
            fontSize: 18,
            fontWeight: "600",
          }}
        >
          {headerTitle ?? "LearningEng"}
        </Text>
      </Animated.View>

      <Animated.ScrollView
        ref={scrollViewRef}
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: theme.colors.background,
          paddingTop: contentTopPadding,
          paddingBottom: contentBottomPadding,
          paddingHorizontal: contentHorizontalPadding,
        }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {children}
      </Animated.ScrollView>
    </View>
  );
}
