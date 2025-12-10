import { useVocabulary } from "@/hooks/useVocabulary";
import { Category } from "@/model/entity/types";
import { SCREEN_HEIGHT_0_5 } from "@/resources/constants/layout";
import { FlatList, StyleSheet } from "react-native";
import { Button, Dialog, Portal, useTheme } from "react-native-paper";

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
      <Dialog visible={visible} onDismiss={onClose} style={{backgroundColor: theme.colors.secondaryContainer}}>
        <Dialog.Title style={{ color: theme.colors.onBackground }}>Select category</Dialog.Title>
        <Dialog.Content>
          <FlatList
            showsVerticalScrollIndicator={false}
            style={{ height: SCREEN_HEIGHT_0_5 }}
            data={allCategories}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Button mode="outlined" style={styles.categoryBtn} onPress={() => onSelectCategory(item)}>
                {item.icon} {item.name}
              </Button>
            )}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            mode="outlined"
            onPress={onClose}
            style={{ backgroundColor: theme.colors.error }}
            textColor={theme.colors.onError}
          >
            Cancel
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  categoryBtn: {
    marginVertical: 4,
    borderRadius: 8,
  },
});
