import { INSERT_INTO_CATEGORIES } from "@/constants/sql/categoriesTable";
import { EntityType } from "@/model/entity/types";
import type { SQLiteDatabase } from "expo-sqlite";

type NewCategory = {
  name: string;
  icon: string;
};

export async function addNewCategory(
  db: SQLiteDatabase,
  newCategory: NewCategory,
  categoryType: EntityType = EntityType.useradd
): Promise<void> {
  const insertionRow = [newCategory.name, categoryType, newCategory.icon];
  await db.runAsync(INSERT_INTO_CATEGORIES, insertionRow);
}
