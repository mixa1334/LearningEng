import { Modal, Pressable, StyleSheet, View } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";

import { useLanguageContext } from "./LanguageProvider";

interface CustomModalDialogProps {
  readonly title: string;
  readonly description: string;
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly children: React.ReactNode;
}

export function CustomModalDialog({
  title,
  description,
  visible,
  onClose,
  children,
}: CustomModalDialogProps) {
  const theme = useTheme();
  const { text } = useLanguageContext();

  const closeLabel = text("custom_modal_dialog_close_accessibility", { title });

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
          {children}
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
});