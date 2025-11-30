import { NewWordDto } from "@/model/dto/NewWordDto";
import { Word } from "@/model/entity/types";
import { addNewWord, getUserWords } from "@/model/service/wordService";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { loadDailyWordSetThunk } from "../../learn/loadDailyWordSetThunk";

export const addWordThunk = createAsyncThunk<Word[], { newWord: NewWordDto }>(
  "vocabulary/addWordThunk",
  async ({ newWord }, { dispatch }) => {
    await addNewWord(newWord);
    dispatch(loadDailyWordSetThunk());
    return getUserWords();
    }
);