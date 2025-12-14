import { array, enum as enum_, number, object, record, string } from "zod/v4";

export const getDailyCheckInSchema = object({
  date: string(),
});

export const createDailyCheckInSchema = object({
  overallMood: enum_(["Great", "Good", "Okay", "Bad", "Awful"]),
  emotions: record(string(), number()),
  learnings: array(string()).optional(),
  memories: array(string()).optional(),
});

export const updateDailyCheckInSchema = object({
  id: string(),
  overallMood: enum_(["Great", "Good", "Okay", "Bad", "Awful"]),
  emotions: record(string(), number()),
  learnings: array(string()).optional(),
  memories: array(string()).optional(),
});
