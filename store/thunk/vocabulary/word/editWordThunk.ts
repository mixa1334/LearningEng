import { Word } from "@/model/entity/types";
import { editUserWord, getUserWords } from "@/model/service/wordService";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const editWordThunk = createAsyncThunk<
  Word[],
  { wordToEdit: Word }
>("vocabulary/editWordThunk", async ({ wordToEdit }) => {
  await editUserWord(wordToEdit);
  return getUserWords();
});
