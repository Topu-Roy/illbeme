import { array, date, enum as enum_, object, string } from "zod";

export const getJournalEntryInputSchema = object({
  date: date(),
});

export const journalEntryOutputSchema = array(
  object({
    id: string(),
    createdAt: date(),
    content: string().min(1),
    mood: enum_(["Great", "Good", "Okay", "Bad", "Awful"]),
  })
);

export const createJournalEntryInputSchema = object({
  content: string().min(1),
  mood: enum_(["Great", "Good", "Okay", "Bad", "Awful"]),
});

export const createJournalEntryOutputSchema = object({
  id: string(),
  createdAt: date(),
  content: string().min(1),
  mood: enum_(["Great", "Good", "Okay", "Bad", "Awful"]),
});

export const deleteJournalEntrySchema = object({
  id: string(),
  createdAt: date(),
});

export const updateJournalEntryInputSchema = object({
  id: string(),
  content: string().min(1),
  mood: enum_(["Great", "Good", "Okay", "Bad", "Awful"]),
});

export const updateJournalEntryOutputSchema = object({
  id: string(),
  createdAt: date(),
  content: string().min(1),
  mood: enum_(["Great", "Good", "Okay", "Bad", "Awful"]),
});
