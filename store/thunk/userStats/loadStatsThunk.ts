import { DateShifts, getCurrentDate } from "@/util/dateHelper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { StatsState } from "../../slice/userStatsSlice";

export const loadStatsThunk = createAsyncThunk<Partial<StatsState>, void>(
  "stats/loadStatsThunk",
  async () => {
    const keys: (keyof StatsState)[] = [
      "name",
      "streak",
      "lastLearningDate",
      "reviewedToday",
      "dailyGoal",
    ];

    const result = await AsyncStorage.multiGet(keys);

    const parsed: Partial<StatsState> = {};

    for (const [key, value] of result) {
      if (value !== null) {
        parsed[key as keyof StatsState] = (
          ["streak", "reviewedToday", "dailyGoal"].includes(key)
            ? Number(value)
            : value
        ) as any;
      }
    }

    const today = getCurrentDate();
    const yesterday = getCurrentDate(DateShifts.yesterday);

    const lastLearningDate = parsed.lastLearningDate as string | null;

    if (lastLearningDate !== today) {
      parsed.reviewedToday = 0;
      await AsyncStorage.setItem("reviewedToday", String(0));

      if (lastLearningDate !== yesterday) {
        parsed.streak = 0;
        await AsyncStorage.setItem("streak", String(0));
      }
    }

    return parsed;
  }
);
