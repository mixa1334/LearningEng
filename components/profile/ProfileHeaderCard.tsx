import { useUserData } from "@/hooks/useUserData";
import { SPACING_MD, SPACING_XL } from "@/resources/constants/layout";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, Text, TextInput, useTheme } from "react-native-paper";

export default function ProfileHeaderCard() {
  const { name, streak, changeName } = useUserData();
  const theme = useTheme();
  const [editableName, setEditableName] = useState(false);

  const toggleEditableName = () => setEditableName((prev) => !prev);

  return (
    <View
      style={[
        styles.profileCard,
        {
          backgroundColor:
            (theme.colors as any).primaryContainer ?? theme.colors.surface,
        },
      ]}
    >
      {editableName ? (
        <View style={styles.nameRow}>
          <TextInput
            mode="flat"
            value={name}
            onChangeText={changeName}
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
            style={[
              styles.editBtn,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
          />
        </View>
      ) : (
        <View style={styles.nameRow}>
          <Text
            variant="headlineSmall"
            style={[styles.name, { color: theme.colors.onPrimaryContainer }]}
          >
            {name}
          </Text>
          <IconButton
            icon="pencil"
            mode="contained"
            onPress={toggleEditableName}
            style={[
              styles.editBtn,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
          />
        </View>
      )}

      <View style={styles.streakRow}>
        <Ionicons name="flame" size={28} color={theme.colors.primary} />
        <Text
          style={[
            styles.streakText,
            { color: theme.colors.onPrimaryContainer },
          ]}
        >
          {streak} days in a row
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
});


