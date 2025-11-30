import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const changeNameThunk = createAsyncThunk<string, string>(
  "stats/changeNameThunk",
  async (newName) => {
    await AsyncStorage.setItem("name", newName);
    return newName;
  }
);
