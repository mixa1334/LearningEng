import { useVocabulary } from "@/src/hooks/useVocabulary";
import { Category } from "@/src/model/entity/types";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Dialog, IconButton, Portal, Text, TextInput, useTheme } from "react-native-paper";
import { CategoryPicker } from "../category/CategoryPicker";

interface CreateWordDialogProps {
  readonly visible: boolean;
  readonly exit: () => void;
}

export default function CreateWordDialog({ visible, exit }: CreateWordDialogProps) {
  const theme = useTheme();
  const { addWord } = useVocabulary();
  const [newWordEn, setNewWordEn] = useState("");
  const [newWordRu, setNewWordRu] = useState("");
  const [newWordTranscription, setNewWordTranscription] = useState("");
  const [newWordTextExample, setNewWordTextExample] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const handleAddWord = () => {
    if (!newWordEn || !newWordRu || !selectedCategory) return;
    addWord({
      word_en: newWordEn,
      word_ru: newWordRu,
      transcription: newWordTranscription,
      category_id: selectedCategory.id,
      text_example: newWordTextExample,
    });
    setNewWordEn("");
    setNewWordRu("");
    setNewWordTranscription("");
    setNewWordTextExample("");
    setSelectedCategory(null);
    setShowCategoryPicker(false);
    exit();
  };

  const selectCategory = (category: Category) => {
    setSelectedCategory(category);
    setShowCategoryPicker(false);
  };

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={exit}
        style={[styles.dialog, { backgroundColor: theme.colors.secondaryContainer }]}
      >
        <View style={styles.headerContainer}>
          <Dialog.Title style={[styles.title, { color: theme.colors.onBackground }]}>
            New word
          </Dialog.Title>
          <IconButton icon="close" size={24} onPress={exit} accessibilityLabel="Close dialog" />
        </View>
        <Dialog.Content>
          <Text style={[styles.subtitle, { color: theme.colors.onBackground }]}>
            Fill in the details of your new vocabulary item.
          </Text>

          <TextInput
            label="English word"
            value={newWordEn}
            onChangeText={setNewWordEn}
            style={styles.input}
            mode="outlined"
            theme={{
              colors: {
                background: theme.colors.surface,
                outline: theme.colors.outlineVariant,
                primary: theme.colors.primary,
              },
            }}
          />
          <TextInput
            label="Russian word"
            value={newWordRu}
            onChangeText={setNewWordRu}
            style={styles.input}
            mode="outlined"
            theme={{
              colors: {
                background: theme.colors.surface,
                outline: theme.colors.outlineVariant,
                primary: theme.colors.primary,
              },
            }}
          />
          <TextInput
            label="Transcription (optional)"
            value={newWordTranscription}
            onChangeText={setNewWordTranscription}
            style={styles.input}
            mode="outlined"
            theme={{
              colors: {
                background: theme.colors.surface,
                outline: theme.colors.outlineVariant,
                primary: theme.colors.primary,
              },
            }}
          />
          <TextInput
            label="Text example (optional)"
            value={newWordTextExample}
            onChangeText={setNewWordTextExample}
            style={styles.input}
            mode="outlined"
            theme={{
              colors: {
                background: theme.colors.surface,
                outline: theme.colors.outlineVariant,
                primary: theme.colors.primary,
              },
            }}
          />
          <Text style={[styles.sectionLabel, { color: theme.colors.onBackground }]}>
            Category
          </Text>
          <Button
            mode="contained-tonal"
            style={[
              styles.categorySelector,
              {
                backgroundColor: theme.colors.outlineVariant,
                borderColor: theme.colors.outlineVariant,
              },
            ]}
            onPress={() => setShowCategoryPicker(!showCategoryPicker)}
            textColor={theme.colors.onSecondaryContainer}
            contentStyle={styles.categorySelectorButtonContent}
          >
            {selectedCategory ? (
              <View style={styles.categorySelectorContent}>
                <Text style={styles.categoryEmoji}>{selectedCategory.icon}</Text>
                <Text style={styles.categoryLabel}>{selectedCategory.name}</Text>
              </View>
            ) : (
              "Select category"
            )}
          </Button>

          <CategoryPicker
            visible={showCategoryPicker}
            onClose={() => setShowCategoryPicker(false)}
            onSelectCategory={selectCategory}
          />
        </Dialog.Content>
        <Dialog.Actions style={styles.actions}>
          <Button mode="contained" icon="plus" onPress={handleAddWord} style={styles.actionButton}>
            Save
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 24,
  },
  title: {
    fontWeight: "700",
  },
  subtitle: {
    marginBottom: 12,
    fontSize: 13,
    opacity: 0.8,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
  },
  input: {
    marginVertical: 8,
    borderRadius: 12,
  },
  categoryBtn: {
    marginVertical: 4,
    borderRadius: 8,
  },
  sectionLabel: {
    marginVertical: 8,
    fontWeight: "600",
    fontSize: 13,
    opacity: 0.9,
  },
  categorySelector: {
    marginBottom: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 999,
  },
  categorySelectorContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  categoryEmoji: {
    fontSize: 18,
  },
  categoryLabel: {
    fontSize: 14,
  },
  categorySelectorButtonContent: {
    justifyContent: "flex-start",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  actionButton: {
    marginHorizontal: 4,
  },
});
