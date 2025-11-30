import { Category } from "@/model/entity/types";
import {
  deleteUserCategory,
  getAllCategories,
} from "@/model/service/categoryService";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { SQLiteDatabase } from "expo-sqlite";

export const removeCategoryThunk = createAsyncThunk<
  Category[],
  { db: SQLiteDatabase; categoryToDelete: Category }
>("vocabulary/removeCategoryThunk", async ({ db, categoryToDelete }) => {
  await deleteUserCategory(db, categoryToDelete);
  return getAllCategories(db);
});
