import { Category } from "@/src/entity/types";
import { useVocabulary } from "@/src/hooks/useVocabulary";
import { useMemo } from "react";
import { ValuePickerDialog } from "../../common/ValuePickerDialog";

interface CategoryPickerProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly onSelectCategory: (category: Category) => void;
}

export function CategoryPicker({ visible, onClose, onSelectCategory }: CategoryPickerProps) {
  const { userCategories, preloadedCategories } = useVocabulary();

  const options = useMemo(() => {
    const allCategories = [...userCategories, ...preloadedCategories];
    return allCategories.map((category) => ({
      value: category,
      key: category.id.toString(),
      label: category.icon + " " + category.name,
    }));
  }, [userCategories, preloadedCategories]);

  return (
    <ValuePickerDialog
      entityTitle="category"
      description="Choose a category to assign. You can change it later."
      visible={visible}
      onClose={onClose}
      options={options}
      onSelectOption={onSelectCategory}
    />
  );
}
