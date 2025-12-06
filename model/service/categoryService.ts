import { Category, EntityType } from "@/model/entity/types";
import { getDbInstance } from "../database/db";
import { NewCategoryDto } from "../dto/NewCategoryDto";
import { UpdateCategoryDto } from "../dto/UpdateCategoryDto";
import { rowToCategory } from "../mapper/typesMapper";

export async function addNewCategory(
  newCategory: NewCategoryDto,
  categoryType: EntityType = EntityType.useradd
): Promise<number> {
  const insertedRow = await getDbInstance().runAsync(`INSERT INTO categories (name, type, icon) VALUES (?, ?, ?)`, [
    newCategory.name,
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
    [category.name, category.icon, category.id]
  );
  return updatedRows.changes > 0;
}
