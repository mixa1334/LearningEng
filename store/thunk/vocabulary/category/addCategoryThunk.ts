import { NewCategoryDto } from "@/model/dto/NewCategoryDto";
import { Category } from "@/model/entity/types";
import { addNewCategory, getAllCategories } from "@/model/service/categoryService";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const addCategoryThunk = createAsyncThunk<
  Category[],
  { newCategory: NewCategoryDto }
>("vocabulary/addCategoryThunk", async ({ newCategory }) => {
  await addNewCategory(newCategory);
  return getAllCategories();
});
