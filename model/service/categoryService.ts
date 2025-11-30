import { Category, EntityType } from "@/model/entity/types";
import { getDbInstance } from "../database/db";
import { NewCategoryDto } from "../dto/NewCategoryDto";
import { rowToCategory } from "../mapper/typesMapper";

export async function addNewCategory(
  newCategory: NewCategoryDto,
  categoryType: EntityType = EntityType.useradd
) {
  await getDbInstance().runAsync(
    `INSERT INTO categories (name, type, icon) VALUES (?, ?, ?)`,
    [newCategory.name, categoryType, newCategory.icon]
  );
}

export async function getAllCategories(): Promise<Category[]> {
  const rows = await getDbInstance().getAllAsync<any>(
    `SELECT id, name, type, icon FROM categories`
  );
  return rows.map(rowToCategory);
}

export async function deleteUserCategory(category: Category): Promise<void> {
  await getDbInstance().withExclusiveTransactionAsync(async (tx) => {
    await tx.runAsync(
      `UPDATE words SET category_id = 1 WHERE category_id = ?`,
      [category.id]
    );

    await tx.runAsync(
      `DELETE FROM categories
       WHERE type = 'user_added' AND id = ?`,
      [category.id]
    );
  });
}

export async function editUserCategory(category: Category): Promise<void> {
  await getDbInstance().runAsync(
    `UPDATE categories SET name = ?, icon = ?
    WHERE type = 'user_added' AND id = ?`,
    [category.name, category.icon, category.id]
  );
}
