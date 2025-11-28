import { Category } from "@/model/entity/types";
import {
    editUserCategory,
    getAllCategories,
} from "@/model/service/categoryService";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { SQLiteDatabase } from "expo-sqlite";

export const editCategoryThunk = createAsyncThunk<
  Category[],
  { db: SQLiteDatabase; categoryToEdit: Category }
>("vocabulary/editCategoryThunk", async ({ db, categoryToEdit }) => {
  await editUserCategory(db, categoryToEdit);
  return getAllCategories(db);
});
