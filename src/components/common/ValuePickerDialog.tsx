import { SCREEN_HEIGHT_0_5 } from "@/src/resources/constants/layout";
import { FlatList, Modal, Pressable, StyleSheet, View } from "react-native";
import { Button, IconButton, Text, useTheme } from "react-native-paper";

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
  const { text, isReady } = useLanguageContext();

  const title = isReady ? text("value_picker_select_title", { entityTitle }) : `Select ${entityTitle}`;
  const closeLabel = isReady
    ? text("value_picker_close_accessibility", { entityTitle })
    : `Close ${entityTitle} picker`;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel={closeLabel} accessibilityRole="button">
        <View
          style={[styles.dialog, { backgroundColor: theme.colors.secondaryContainer }]}
          onStartShouldSetResponder={() => true}
        >
          <View style={styles.headerContainer}>
            <Text style={[styles.title, { color: theme.colors.onBackground }]}>{title}</Text>
            <IconButton icon="close" size={24} onPress={onClose} accessibilityLabel={closeLabel} />
          </View>
          <Text style={[styles.subtitle, { color: theme.colors.onBackground }]}>{description}</Text>
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
                {item.label}
              </Button>
            )}
          />
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  dialog: {
    width: "90%",
    borderRadius: 24,
    padding: 16,
  },
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  title: {
    fontWeight: "700",
  },
  subtitle: {
    marginBottom: 12,
    fontSize: 13,
    opacity: 0.8,
    paddingHorizontal: 10,
  },
  categoryBtn: {
    marginVertical: 4,
    borderRadius: 8,
  },
  categoryBtnContent: {
    justifyContent: "flex-start",
  },
});
