import { Category } from "@/model/entity/types";
import {
  deleteUserCategory,
  getAllCategories,
} from "@/model/service/categoryService";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const removeCategoryThunk = createAsyncThunk<
  Category[],
  { categoryToDelete: Category }
>("vocabulary/removeCategoryThunk", async ({ categoryToDelete }) => {
  await deleteUserCategory(categoryToDelete);
  return getAllCategories();
});
