import { useUserData } from "@/src/hooks/useUserData";
import { SPACING_MD, SPACING_XL } from "@/src/resources/constants/layout";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, Text, TextInput } from "react-native-paper";

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
    <View
      style={[
        styles.profileCard,
        {
          backgroundColor: theme.colors.primaryContainer,
        },
        getCardShadow(theme),
      ]}
    >
      {editableName ? (
        <View style={styles.nameRow}>
          <TextInput
            mode="flat"
            value={nameInput}
            onChangeText={setNameInput}
            onBlur={toggleEditableName}
            autoFocus
            style={styles.nameInput}
            underlineColor={theme.colors.primary}
            selectionColor={theme.colors.primary}
          />
          <IconButton
            icon="check"
            mode="contained"
            onPress={toggleEditableName}
            style={[styles.editBtn, { backgroundColor: theme.colors.surfaceVariant }]}
          />
        </View>
      ) : (
        <View style={styles.nameRow}>
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
            variant="headlineSmall"
            style={[isHihik ? styles.hihikText : styles.name, { color: theme.colors.onPrimaryContainer }]}
          >
            {stringHelper.truncate(name, isHihik ? 8 : 20)}
          </Text>
          {!isHihik && (<IconButton
            icon="pencil"
            mode="contained"
            onPress={toggleEditableName}
            style={[styles.editBtn, { backgroundColor: theme.colors.surfaceVariant }]}
          />)}
          {isHihik && (
            <LottieView
              source={require("@/assets/animations/berry_frame.json")}
              autoPlay
              loop={true}
              resizeMode="cover"
              style={styles.berryFrame}
            />
          )}
        </View>
      )}

      <View style={styles.streakRow}>
        {dailyGoalAchieve ? (
          <LottieView
            source={isHihik ? require("@/assets/animations/like.json") : require("@/assets/animations/streak_fire.json")}
            autoPlay
            loop={true}
            resizeMode="contain"
            style={styles.streakFireAnimation}
          />
        ) : (
          <Ionicons name="flame" size={28} color={theme.colors.primary} />
        )}
        <Text style={[styles.streakText, { color: theme.colors.onPrimaryContainer }]}>
          {text("profile_streak_text", { count: streak })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    borderRadius: 24,
    padding: SPACING_XL,
    marginBottom: SPACING_XL,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  name: {
    fontWeight: "700",
    marginRight: 4,
  },
  nameInput: {
    flex: 1,
    marginRight: SPACING_MD,
    fontWeight: "700",
  },
  editBtn: {
    borderRadius: 50,
    margin: 0,
    marginLeft: 4,
  },
  streakRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  streakText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
  },
  berryFrame: {
    width: 100,
    height: 100,
  },
  hihikText: {
    fontFamily: "Iowan Old Style",
    fontSize: 32,
    fontWeight: "800",
  },
  streakFireAnimation: {
    width: 45,
    height: 45,
  },
});
