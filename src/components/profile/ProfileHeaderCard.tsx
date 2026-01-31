import { useUserData } from "@/src/hooks/useUserData";
import { SPACING_MD, SPACING_XL } from "@/src/resources/constants/layout";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { IconButton, Text, TextInput } from "react-native-paper";
import Animated, { FadeInDown, Layout } from "react-native-reanimated";

import { stringHelper } from "@/src/util/stringHelper";
import LottieView from "lottie-react-native";
import { getCardShadow } from "../common/cardShadow";
import { useHaptics } from "../common/HapticsProvider";
import { useLanguageContext } from "../common/LanguageProvider";
import { useAppTheme, useThemeContext } from "../common/ThemeProvider";

export default function ProfileHeaderCard() {
  const { name, streak, changeName, dailyGoalAchieve } = useUserData();
  const { isHihik } = useThemeContext();
  const theme = useAppTheme();
  const { text } = useLanguageContext();
  const [editableName, setEditableName] = useState(false);
  const [nameInput, setNameInput] = useState<string>(name);
  const { heavyImpact } = useHaptics();

  const toggleEditableName = () => {
    heavyImpact();
    setEditableName((prev) => {
      if (prev) {
        changeName(nameInput.trim());
        return false;
      }
      return true;
    });
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(100).springify()}
      layout={Layout.springify()}
      style={[
        styles.profileCard,
        {
          backgroundColor: theme.colors.primaryContainer,
        },
        getCardShadow(theme),
      ]}
    >
      <View style={styles.contentContainer}>
        {editableName ? (
          <View style={styles.nameRow}>
            <TextInput
              mode="flat"
              value={nameInput}
              onChangeText={setNameInput}
              onBlur={toggleEditableName}
              autoFocus
              style={[styles.nameInput, { backgroundColor: "transparent" }]}
              underlineColor={theme.colors.onPrimaryContainer}
              textColor={theme.colors.onPrimaryContainer}
              selectionColor={theme.colors.onPrimaryContainer}
            />
            <IconButton
              icon="check"
              mode="contained"
              onPress={toggleEditableName}
              containerColor={theme.colors.surface}
              iconColor={theme.colors.primary}
              size={20}
            />
          </View>
        ) : (
          <View style={styles.nameRow}>
            <View style={styles.nameContainer}>
                {isHihik && (
                    <LottieView
                    source={require("@/assets/animations/berry_frame.json")}
                    autoPlay
                    loop={true}
                    resizeMode="cover"
                    style={styles.berryFrame}
                    />
                )}
                <Text
                    variant="headlineMedium"
                    style={[
                    isHihik ? styles.hihikText : styles.name,
                    { color: theme.colors.onPrimaryContainer },
                    ]}
                >
                    {stringHelper.truncate(name, isHihik ? 8 : 15)}
                </Text>
                {!isHihik && (
                    <IconButton
                        icon="pencil"
                        size={18}
                        onPress={toggleEditableName}
                        iconColor={theme.colors.onPrimaryContainer}
                        style={{ margin: 0 }}
                    />
                )}
            </View>
          </View>
        )}

        <View style={[styles.streakContainer, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.streakInfo}>
            <Text style={[styles.streakLabel, { color: theme.colors.onSurfaceVariant }]}>
                {text("profile_streak_label") || "Current Streak"}
            </Text>
            <Text style={[styles.streakValue, { color: theme.colors.onSurface }]}>
                {streak} <Text style={{ fontSize: 16, fontWeight: "500" }}>{text("days_count", { count: streak }).replace(streak.toString(), "")}</Text>
            </Text>
          </View>
            {dailyGoalAchieve ? (
            <LottieView
                source={isHihik ? require("@/assets/animations/like.json") : require("@/assets/animations/streak_fire.json")}
                autoPlay
                loop={true}
                resizeMode="contain"
                style={styles.streakFireAnimation}
            />
            ) : (
            <Ionicons name="flame" size={32} color={theme.colors.error} style={{ opacity: 0.8 }} />
            )}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    borderRadius: 32,
    marginBottom: SPACING_XL,
    overflow: "hidden",
  },
  contentContainer: {
      padding: SPACING_XL,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  nameContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
  },
  name: {
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  nameInput: {
    flex: 1,
    marginRight: SPACING_MD,
    fontWeight: "700",
    fontSize: 24,
    height: 40,
    paddingHorizontal: 0,
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 20,
  },
  streakInfo: {
      flexDirection: "column",
      gap: 2,
  },
  streakLabel: {
      fontSize: 12,
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: 0.5,
  },
  streakValue: {
      fontSize: 28,
      fontWeight: "800",
      lineHeight: 32,
  },
  berryFrame: {
    width: 60,
    height: 60,
    position: "absolute",
    left: -10,
    top: -10,
  },
  hihikText: {
    fontFamily: "Iowan Old Style",
    fontSize: 32,
    fontWeight: "800",
  },
  streakFireAnimation: {
    width: 50,
    height: 50,
  },
});
