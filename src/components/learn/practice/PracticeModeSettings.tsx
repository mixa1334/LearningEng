import { EntityType } from "@/src/entity/types";
import { usePractice } from "@/src/hooks/usePractice";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, IconButton, Switch } from "react-native-paper";

import { getCardShadow } from "../../common/cardShadow";
import { useLanguageContext } from "../../common/LanguageProvider";
import { useSoundPlayer } from "../../common/SoundProvider";
import { useAppTheme } from "../../common/ThemeProvider";
import { ValuePickerDialog } from "../../common/ValuePickerDialog";
import PickCategoryButton from "../../vocabulary/category/PickCategoryButton";

const practiceLimitLabels = [
  { value: 5, key: "5", label: "5" },
  { value: 10, key: "10", label: "10" },
  { value: 20, key: "20", label: "20" },
  { value: 50, key: "50", label: "50" },
];

export default function PracticeModeSettings() {
  const { category, wordType, practiceLimit, setCategory, setWordType, setPracticeLimit, resetCriteria } = usePractice();
  const theme = useAppTheme();
  const { text } = useLanguageContext();
  const { playTap } = useSoundPlayer();

  const [isLimitPickerVisible, setIsLimitPickerVisible] = useState(false);

  const handleSwitchWordType = () => {
    const userAddedWordsOnly = wordType === EntityType.useradd ? undefined : EntityType.useradd;
    setWordType(userAddedWordsOnly);
  };

  const handleSelectLimit = (limit: number) => {
    setPracticeLimit(limit);
    setIsLimitPickerVisible(false);
  };

  const handleResetCriteria = () => {
    playTap();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    resetCriteria();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surfaceVariant }, getCardShadow(theme)]}>
      <IconButton
        icon="refresh"
        onPress={handleResetCriteria}
        iconColor={theme.colors.onError}
        containerColor={theme.colors.error}
        size={18}
        accessibilityLabel={text("practice_reset_criteria_accessibility")}
        style={styles.resetButton}
      />
      <View style={styles.rowContainer}>
        <Text style={[styles.label, { color: theme.colors.onSurface }]}>{text("practice_label_only_user_words")}</Text>
        <Switch value={wordType === EntityType.useradd} onValueChange={handleSwitchWordType} />
      </View>

      <View style={styles.rowContainer}>
        <Text style={[styles.label, { color: theme.colors.onSurface }]}>{text("practice_label_word_limit")}</Text>
        <Button
          mode="contained-tonal"
          onPress={() => setIsLimitPickerVisible(true)}
          compact
          style={{ borderRadius: 999, backgroundColor: theme.colors.secondary }}
          contentStyle={{ paddingHorizontal: 5 }}
          icon="chevron-down"
          textColor={theme.colors.onSecondary}
        >
          <Text style={[styles.label, { color: theme.colors.onSecondary }]}>{practiceLimit}</Text>
        </Button>
        <ValuePickerDialog
          entityTitle={text("practice_limit_title")}
          description={text("practice_limit_description")}
          visible={isLimitPickerVisible}
          onClose={() => setIsLimitPickerVisible(false)}
          options={practiceLimitLabels}
          onSelectOption={handleSelectLimit}
        />
      </View>
      <View style={styles.rowContainer}>
        <Text style={[styles.label, { color: theme.colors.onSurface }]}>{text("practice_label_category")}</Text>
        <PickCategoryButton category={category} onSelectCategory={setCategory} truncateLength={15}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 16,
    marginTop: 8,
    gap: 16,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  resetButton: {
    position: "absolute",
    top: 3,
    left: 3,
  },
});
