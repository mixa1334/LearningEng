import { Category } from "@/model/entity/types";
import {
    editUserCategory,
    getAllCategories,
} from "@/model/service/categoryService";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const editCategoryThunk = createAsyncThunk<
  Category[],
  { categoryToEdit: Category }
>("vocabulary/editCategoryThunk", async ({ categoryToEdit }) => {
  await editUserCategory(categoryToEdit);
  return getAllCategories();
});
