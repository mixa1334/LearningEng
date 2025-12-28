import { Category } from "@/src/entity/types";
import { useVocabulary } from "@/src/hooks/useVocabulary";
import { SCREEN_HEIGHT_0_5 } from "@/src/resources/constants/layout";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, Dialog, IconButton, Portal, Text, useTheme } from "react-native-paper";

interface CategoryPickerProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly onSelectCategory: (category: Category) => void;
}

export function CategoryPicker({ visible, onClose, onSelectCategory }: CategoryPickerProps) {
  const theme = useTheme();
  const { allCategories } = useVocabulary();

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onClose}
        style={[styles.dialog, { backgroundColor: theme.colors.secondaryContainer }]}
      >
        <View style={styles.headerContainer}>
          <Dialog.Title style={[styles.title, { color: theme.colors.onBackground }]}>
            Select category
          </Dialog.Title>
          <IconButton icon="close" size={24} onPress={onClose} accessibilityLabel="Close category picker" />
        </View>
        <Dialog.Content>
          <Text style={[styles.subtitle, { color: theme.colors.onBackground }]}>
            Choose a category to assign. You can change it later.
          </Text>
          <FlatList
            showsVerticalScrollIndicator={false}
            style={{ height: SCREEN_HEIGHT_0_5 }}
            data={allCategories}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Button
                mode="contained-tonal"
                style={[
                  styles.categoryBtn,
                  { backgroundColor: theme.colors.secondaryContainer },
                ]}
                textColor={theme.colors.onSecondaryContainer}
                contentStyle={styles.categoryBtnContent}
                onPress={() => onSelectCategory(item)}
              >
                {item.icon} {item.name}
              </Button>
            )}
          />
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 24,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
  },
  title: {
    fontWeight: "700",
  },
  subtitle: {
    marginBottom: 12,
    fontSize: 13,
    opacity: 0.8,
  },
  categoryBtn: {
    marginVertical: 4,
    borderRadius: 8,
  },
  categoryBtnContent: {
    justifyContent: "flex-start",
  },
});
