import { Word } from "@/model/entity/types";
import { deleteUserWord, getUserWords } from "@/model/service/wordService";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const removeWordThunk = createAsyncThunk<
  Word[],
  { wordToDelete: Word }
>(
  "vocabulary/removeWordThunk",
  async ({ wordToDelete }) => {
    await deleteUserWord(wordToDelete);
    return getUserWords();
    }
);