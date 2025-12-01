import { DateShifts, getCurrentDate } from "@/util/dateHelper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { StatisticsState } from "../../slice/statisticsSlice";

/// REFACTOR !!!!!!!!!!!!!!! (set up as lazy init in initial state in slice!!!)
export const loadStatsThunk = createAsyncThunk<Partial<StatisticsState>>(
  "stats/loadStatsThunk",
  async () => {
    const keys: (keyof StatisticsState)[] = [
      "name",
      "streak",
      "lastLearningDate",
      "reviewedToday",
      "dailyGoal",
      "dailyGoalAchieve",
    ];

    const result = await AsyncStorage.multiGet(keys as string[]);

    const parsed: Partial<StatisticsState> = {};

    for (const [key, value] of result) {
      const parseValue = (value: any) => {
        parsed[key as keyof StatisticsState] = value;
      };
      if (value !== null) {
        let tempValue: any = value;
        if (["streak", "reviewedToday", "dailyGoal"].includes(key)) {
          tempValue = Number(value);
        } else if (["dailyGoalAchieve"].includes(key)) {
          tempValue = Boolean(value);
        }
        parseValue(tempValue);
      }
    }

    const today = getCurrentDate();
    const yesterday = getCurrentDate(DateShifts.yesterday);

    const lastLearningDate = parsed.lastLearningDate as string | null;

    if (lastLearningDate !== today) {
      parsed.dailyGoalAchieve = false;
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
