import { NewCategoryDto } from "@/model/dto/NewCategoryDto";
import { Category } from "@/model/entity/types";
import { addNewCategory, getAllCategories } from "@/model/service/categoryService";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { SQLiteDatabase } from "expo-sqlite";

export const addCategoryThunk = createAsyncThunk<
  Category[],
  { db: SQLiteDatabase; newCategory: NewCategoryDto }
>("vocabulary/addCategoryThunk", async ({db, newCategory}) => {
    await addNewCategory(db, newCategory);
    return getAllCategories(db);
});
