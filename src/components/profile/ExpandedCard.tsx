import { SPACING_XL } from "@/src/resources/constants/layout";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withTiming
} from "react-native-reanimated";
import { useAutoScroll } from "../common/AutoScrollContext";
import { getCardShadow } from "../common/cardShadow";
import { useAppTheme } from "../common/ThemeProvider";

interface ExpandedCardProps {
  readonly title: string;
  readonly touchableOpacity: number;
  readonly children: React.ReactNode;
  readonly autoScroll: boolean;
  readonly icon?: keyof typeof MaterialIcons.glyphMap;
}

export default function ExpandedCard({
  title,
  touchableOpacity,
  children,
  autoScroll,
  icon,
}: ExpandedCardProps) {
  const { triggerScroll } = useAutoScroll();
  const theme = useAppTheme();
  
  const [expanded, setExpanded] = useState(false);

  const rotation = useDerivedValue(() => {
    return withTiming(expanded ? 180 : 0, { duration: 300 });
  }, [expanded]);

  const toggleExpanded = () => {
    const nextState = !expanded;
    setExpanded(nextState);
    if (autoScroll) {
      triggerScroll();
    }
  };

  const arrowStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View
      style={[
        styles.cardContainer,
        { backgroundColor: theme.colors.surfaceVariant },
        getCardShadow(theme),
      ]}
    >
        <Pressable
          onPress={toggleExpanded}
          style={({ pressed }) => [
            styles.headerRow,
            { opacity: pressed ? touchableOpacity : 1 },
          ]}
        >
          <View style={styles.titleContainer}>
            {icon && (
              <MaterialIcons
                name={icon}
                size={20}
                color={theme.colors.primary}
                style={styles.icon}
              />
            )}
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.colors.onSurface },
              ]}
            >
              {title}
            </Text>
          </View>
          <Animated.View style={arrowStyle}>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={24}
              color={theme.colors.onSurfaceVariant}
            />
          </Animated.View>
        </Pressable>

        {expanded && (
            <View style={styles.contentInner}>{children}</View>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 24,
    marginBottom: SPACING_XL,
    overflow: "visible", // Shadow needs visible overflow
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: SPACING_XL,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  icon: {
    marginRight: 4,
  },
  contentInner: {
    paddingHorizontal: SPACING_XL,
    paddingBottom: SPACING_XL,
  },
});
