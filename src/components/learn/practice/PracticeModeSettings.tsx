import { EntityType } from "@/src/entity/types";
import { usePractice } from "@/src/hooks/usePractice";
import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Button, IconButton, Switch } from "react-native-paper";
import { useAppTheme } from "../../common/ThemeProvider";
import { ValuePickerDialog } from "../../common/ValuePickerDialog";
import PickCategoryButton from "../../vocabulary/category/PickCategoryButton";

const practiceLimitLabels = [
  { value: 5, label: "5" },
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 50, label: "50" },
];

export default function PracticeModeSettings() {
  const { category, wordType, practiceLimit, setCategory, setWordType, setPracticeLimit, resetCriteria } = usePractice();
  const theme = useAppTheme();

  const [isLimitPickerVisible, setIsLimitPickerVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-16)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const handleSwitchWordType = () => {
    const userAddedWordsOnly = wordType === EntityType.useradd ? undefined : EntityType.useradd;
    setWordType(userAddedWordsOnly);
  };

  const handleSelectLimit = (limit: number) => {
    setPracticeLimit(limit);
    setIsLimitPickerVisible(false);
  };

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacityAnim, slideAnim]);

  return (
    <Animated.View style={{ transform: [{ translateY: slideAnim }], opacity: opacityAnim }}>
      <View style={[styles.container, { backgroundColor: theme.colors.surfaceVariant }]}>
        <IconButton
          icon="refresh"
          onPress={() => resetCriteria()}
          iconColor={theme.colors.onError}
          containerColor={theme.colors.error}
          size={18}
          accessibilityLabel="Reset criteria"
          style={styles.resetButton}
        />
        <View style={styles.switcherContainer}>
          <Text style={[styles.label, { color: theme.colors.onSurface }]}>Only user words</Text>
          <Switch value={wordType === EntityType.useradd} onValueChange={handleSwitchWordType} />
        </View>

        <View style={styles.limitContainer}>
          <Text style={[styles.label, { color: theme.colors.onSurface }]}>Word limit</Text>
          <Button
            mode="contained-tonal"
            onPress={() => setIsLimitPickerVisible(true)}
            compact
            style={{ borderRadius: 999, backgroundColor: theme.colors.secondary }}
            contentStyle={{ paddingHorizontal: 5 }}
            icon="chevron-down"
            textColor={theme.colors.onSecondary}
          >
            <Text style={[styles.limitValue]}>{practiceLimit}</Text>
          </Button>
          <ValuePickerDialog
            entityTitle="practice limit"
            description="Choose a practice limit"
            visible={isLimitPickerVisible}
            onClose={() => setIsLimitPickerVisible(false)}
            options={practiceLimitLabels.map((label) => ({
              value: label.value,
              key: label.value.toString(),
              label: label.label,
            }))}
            onSelectOption={handleSelectLimit}
          />
        </View>
          <PickCategoryButton category={category} onSelectCategory={setCategory} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    paddingHorizontal: 40,
    paddingTop: 60,
    paddingBottom: 10,
    borderRadius: 12,
    marginTop: 8,
    gap: 16,
  },
  switcherContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  limitContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  limitValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  resetButton: {
    position: "absolute",
    top: 4,
    left: 4,
  },
});
