import { array, number, object, record, string } from "zod/v4";

export const generateDayRatingSchema = object({
  overallMood: string(),
  emotions: record(string(), number()),
  lessonsLearned: array(string()).optional(),
  learnings: array(string()).optional(),
});
