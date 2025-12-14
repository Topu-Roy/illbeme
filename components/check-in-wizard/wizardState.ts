import { type Mood } from "@/generated/prisma/enums";
import { atom } from "jotai";

export type Emotion =
  | "Happy"
  | "Excited"
  | "Relaxed"
  | "Sad"
  | "Anxious"
  | "Angry"
  | "Tired"
  | "Frustrated"
  | "Proud"
  | "Grateful"
  | "Confused"
  | "Hopeful";

type Memory = {
  id: string;
  content: string;
};

type Learnings = {
  id: string;
  content: string;
};

export const overallMoodAtom = atom<Mood | null>(null);
export const learningsAtom = atom<Learnings[]>([]);
export const memoriesAtom = atom<Memory[]>([]);
export const emotionsAtom = atom<Record<Emotion, number>>({
  Happy: 0,
  Excited: 0,
  Relaxed: 0,
  Sad: 0,
  Anxious: 0,
  Angry: 0,
  Tired: 0,
  Frustrated: 0,
  Proud: 0,
  Grateful: 0,
  Confused: 0,
  Hopeful: 0,
});
