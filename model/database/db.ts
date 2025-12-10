import type { SQLiteDatabase } from "expo-sqlite";

let dbInstance: SQLiteDatabase | null = null;

export function setDbInstance(db: SQLiteDatabase) {
  dbInstance = db;
}

export function getDbInstance(): SQLiteDatabase {
  if (!dbInstance) {
    throw new Error("Database instance is not initialized yet");
  }
  return dbInstance;
}


