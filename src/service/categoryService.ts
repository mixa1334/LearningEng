import { Category, EntityType } from "@/src/entity/types";
import { getDbInstance } from "../database/db";
import { NewCategoryDto } from "../dto/NewCategoryDto";
import { UpdateCategoryDto } from "../dto/UpdateCategoryDto";
import { rowToCategory } from "../mapper/typesMapper";
import { trimTextForSaving } from "../util/stringHelper";

// db always has preloaded category with id 1!!!!!! (if migration have been run successfully)

export async function deleteAllUserCategories(): Promise<boolean> {
  await getDbInstance().runAsync("UPDATE words SET category_id = 1 WHERE type = 'user_added'");
  const deletedRows = await getDbInstance().runAsync("DELETE FROM categories WHERE type = 'user_added'");
  return deletedRows.changes > 0;
}

export async function addNewCategoriesBatch(
  newCategories: NewCategoryDto[],
  categoryType: EntityType = EntityType.useradd
): Promise<void> {
  if (!newCategories.length) {
    return;
  }

  const db = getDbInstance();
  const PARAMS_PER_CATEGORY = 3;
  const MAX_PARAMS = 900;
  const BATCH_SIZE = Math.max(1, Math.floor(MAX_PARAMS / PARAMS_PER_CATEGORY));

  await db.withExclusiveTransactionAsync(async (tx) => {
    for (let i = 0; i < newCategories.length; i += BATCH_SIZE) {
      const batch = newCategories.slice(i, i + BATCH_SIZE);
      const placeholders = batch.map(() => "(?, ?, ?)").join(", ");
      const sql = `INSERT INTO categories (name, type, icon) VALUES ${placeholders}`;

      const params: (string | EntityType)[] = [];
      for (const category of batch) {
        params.push(trimTextForSaving(category.name), categoryType, category.icon);
      }

      await tx.runAsync(sql, params);
    }
  });
}

export async function addNewCategory(
  newCategory: NewCategoryDto,
  categoryType: EntityType = EntityType.useradd
): Promise<number> {
  const insertedRow = await getDbInstance().runAsync(`INSERT INTO categories (name, type, icon) VALUES (?, ?, ?)`, [
    trimTextForSaving(newCategory.name),
    categoryType,
    newCategory.icon,
  ]);
  return insertedRow.lastInsertRowId;
}

export async function getAllCategories(limit: number): Promise<Category[]> {
  const rows = await getDbInstance().getAllAsync<any>(
    `SELECT id, name, type, icon
    FROM categories LIMIT ?`,
    [limit]
  );
  return rows.map(rowToCategory);
}

export async function getCategoriesByType(categoryType: EntityType): Promise<Category[]> {
  const rows = await getDbInstance().getAllAsync<any>(
    `SELECT id, name, type, icon
    FROM categories
    WHERE type = ?`,
    [categoryType]
  );
  return rows.map(rowToCategory);
}

export async function deleteUserCategory(category: Category): Promise<boolean> {
  let result = false;
  await getDbInstance().withExclusiveTransactionAsync(async (tx) => {
    const existedCategory = await tx.getFirstAsync<{ id: number }>(`SELECT id FROM categories WHERE id = ?`, [category.id]);
    if (!existedCategory) {
      throw new Error(`Category with id ${category.id} does not exist`);
    }

    await tx.runAsync(`UPDATE words SET category_id = 1 WHERE category_id = ?`, [existedCategory.id]);

    const deletedRows = await tx.runAsync(
      `DELETE FROM categories
       WHERE type = 'user_added' AND id = ?`,
      [existedCategory.id]
    );
    result = deletedRows.changes > 0;
  });
  return result;
}

export async function editUserCategory(category: UpdateCategoryDto): Promise<boolean> {
  const updatedRows = await getDbInstance().runAsync(
    `UPDATE categories SET name = ?, icon = ?
    WHERE type = 'user_added' AND id = ?`,
    [trimTextForSaving(category.name), category.icon, category.id]
  );
  return updatedRows.changes > 0;
}
