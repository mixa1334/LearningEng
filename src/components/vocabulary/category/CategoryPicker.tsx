import { Category } from "@/src/entity/types";
import { useVocabulary } from "@/src/hooks/useVocabulary";
import { SCREEN_HEIGHT_0_5 } from "@/src/resources/constants/layout";
import { FlatList, Modal, StyleSheet, View } from "react-native";
import { Button, IconButton, Text, useTheme } from "react-native-paper";

interface CategoryPickerProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly onSelectCategory: (category: Category) => void;
}

export function CategoryPicker({
  visible,
  onClose,
  onSelectCategory,
}: CategoryPickerProps) {
  const theme = useTheme();
  const { userCategories, preloadedCategories } = useVocabulary();
  const allCategories = [...userCategories, ...preloadedCategories];

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View
          style={[
            styles.dialog,
            { backgroundColor: theme.colors.secondaryContainer },
          ]}
        >
          <View style={styles.headerContainer}>
            <Text style={[styles.title, { color: theme.colors.onBackground }]}>
              Select category
            </Text>
            <IconButton
              icon="close"
              size={24}
              onPress={onClose}
              accessibilityLabel="Close category picker"
            />
          </View>
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
        </View>
      </View>
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
