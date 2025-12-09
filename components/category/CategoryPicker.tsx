import { useVocabulary } from "@/hooks/useVocabulary";
import { Category } from "@/model/entity/types";
import { View } from "react-native";
import { Text } from "react-native-paper";

interface CategoryPickerProps {
    readonly onClose: () => void;
    readonly onSelectCategory: (category: Category) => void;
}
export function CategoryPicker({ onClose, onSelectCategory }: CategoryPickerProps) {
    const {allCategories} = useVocabulary();

  return (
    <View>
      <Text>Category Picker</Text>
    </View>
  );
}