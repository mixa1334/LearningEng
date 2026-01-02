import { useAutoScroll } from "@/src/components/common/AutoScrollContext";
import {
  SPACING_MD,
  SPACING_XXL,
  TAB_BAR_BASE_HEIGHT,
} from "@/src/resources/constants/layout";
import React, { useState } from "react";
import { Animated, Platform, RefreshControl, Text } from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface AnimatedScrollViewProps {
  readonly children: React.ReactNode;
  readonly title?: string;
  readonly refreshingEnabled: boolean;
  readonly refreshAction?: () => void;
}

export default function AnimatedScrollView({
  children,
  title,
  refreshingEnabled,
  refreshAction,
}: AnimatedScrollViewProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { scrollViewRef } = useAutoScroll();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      refreshAction?.();
      setRefreshing(false);
    }, 200);
  };

  const HEADER_HEIGHT = insets.top + SPACING_XXL;
  const contentHorizontalPadding = SPACING_MD;
  const contentBottomPadding =
    insets.bottom + SPACING_XXL + TAB_BAR_BASE_HEIGHT;

  const scrollY = React.useRef(new Animated.Value(0)).current;

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [-HEADER_HEIGHT, 0],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <>
      <Animated.View
        style={{
          position: "absolute",

          left: 0,
          right: 0,
          height: HEADER_HEIGHT,
          backgroundColor: theme.colors.primary,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: SPACING_MD,
          paddingTop: insets.top,
          transform: [{ translateY: headerTranslateY }],
          opacity: headerOpacity,
          zIndex: 10,
        }}
      >
        <Text
          style={{
            color: theme.colors.onPrimary,
            fontSize: 18,
            fontWeight: "600",
          }}
        >
          {title ?? "LearningEng"}
        </Text>
      </Animated.View>

      <Animated.ScrollView
        ref={scrollViewRef}
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentInset={
          Platform.OS === "ios" ? { top: insets.top * 1.5 } : undefined
        }
        contentOffset={
          Platform.OS === "ios" ? { x: 0, y: -insets.top * 1.5 } : undefined
        }
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: theme.colors.background,
          paddingBottom: contentBottomPadding,
          paddingHorizontal: contentHorizontalPadding,
        }}
        refreshControl={
          refreshingEnabled ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              progressViewOffset={insets.top}
              // iOS indicator color
              tintColor={theme.colors.primary}
              titleColor={theme.colors.onPrimary}
              // Android indicator colors
              colors={[theme.colors.primary]}
              progressBackgroundColor={theme.colors.surface}
            />
          ) : undefined
        }
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {children}
      </Animated.ScrollView>
    </>
  );
}