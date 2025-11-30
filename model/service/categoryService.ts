import { Category, EntityType } from "@/model/entity/types";
import {
  DELETE_CATEGORY,
  INSERT_INTO_CATEGORIES,
  SELECT_CATEGORIES,
  UPDATE_CATEGORY,
} from "@/resources/sql/categoriesTable";
import type { SQLiteDatabase } from "expo-sqlite";
import { NewCategoryDto } from "../dto/NewCategoryDto";
import { rowToCategory } from "../mapper/typesMapper";

export async function addNewCategory(
  db: SQLiteDatabase,
  newCategory: NewCategoryDto,
  categoryType: EntityType = EntityType.useradd
) {
  const insertionRow = [newCategory.name, categoryType, newCategory.icon];
  await db.runAsync(INSERT_INTO_CATEGORIES, insertionRow);
}

export async function getAllCategories(
  db: SQLiteDatabase
): Promise<Category[]> {
  const rows = await db.getAllAsync<any>(SELECT_CATEGORIES);
  return rows.map(rowToCategory);
}

export async function deleteUserCategory(
  db: SQLiteDatabase,
  category: Category
): Promise<void> {
  await db.withExclusiveTransactionAsync(async (tx) => {
    await tx.runAsync(
      `UPDATE words SET category_id = 1 WHERE category_id = ?`,
      [category.id]
    );

    await tx.runAsync(
      `${DELETE_CATEGORY}
       WHERE type = 'user_added' AND id = ?`,
      [category.id]
    );
  });
}

export async function editUserCategory(
  db: SQLiteDatabase,
  category: Category
): Promise<void> {
  await db.runAsync(
    `${UPDATE_CATEGORY}
    WHERE type = 'user_added' AND id = ?`,
    [category.name, category.icon, category.id]
  );
}
