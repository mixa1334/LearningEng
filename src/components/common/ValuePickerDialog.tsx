import { SCREEN_HEIGHT_0_5 } from "@/src/resources/constants/layout";
import { FlatList, StyleSheet } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";

import { CustomModalDialog } from "./CustomModalDialog";
import { useLanguageContext } from "./LanguageProvider";

interface ValuePickerDialogProps<T> {
  readonly entityTitle: string;
  readonly description: string;
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly options: { value: T; key: string; label: string }[];
  readonly onSelectOption: (value: T) => void;
}

export function ValuePickerDialog<T>({
  entityTitle,
  description,
  visible,
  onClose,
  options,
  onSelectOption,
}: ValuePickerDialogProps<T>) {
  const theme = useTheme();
  const { text } = useLanguageContext();

  const title = text("value_picker_select_title", { entityTitle });

  return (
    <CustomModalDialog title={title} description={description} visible={visible} onClose={onClose}>
      <FlatList
        showsVerticalScrollIndicator={false}
        style={{ maxHeight: SCREEN_HEIGHT_0_5 }}
        data={options}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <Button
            mode="contained-tonal"
            style={[styles.categoryBtn, { backgroundColor: theme.colors.secondaryContainer }]}
            textColor={theme.colors.onSecondaryContainer}
            contentStyle={styles.categoryBtnContent}
            onPress={() => onSelectOption(item.value)}
          >
            <Text style={styles.valueText}>{item.label}</Text>
          </Button>
        )}
      />
    </CustomModalDialog>
  );
}

const styles = StyleSheet.create({
  categoryBtn: {
    marginVertical: 4,
    borderRadius: 8,
  },
  categoryBtnContent: {
    justifyContent: "flex-start",
  },
  valueText: {
    fontSize: 16,
  },
});
