import "server-only";
import { google } from "@ai-sdk/google";
import { generateObject, generateText } from "ai";
import { int } from "zod";

type DayRatingInput = {
  overallMood: string;
  emotions: Record<string, number>;
  lessonsLearned?: string;
  learnings?: string[];
};

export async function generateDayRating(input: DayRatingInput) {
  const { overallMood, emotions, lessonsLearned, learnings } = input;

  const emotionsList = Object.entries(emotions)
    .filter(([_, count]) => count > 0)
    .map(([emotion, count]) => `${emotion} triggered (${count} times)`)
    .join(", ");

  const learningsList =
    learnings && learnings.length > 0 ? learnings.join("; ") : (lessonsLearned ?? "None recorded");

  const prompt = `You are a mental health assessment AI. Based on the following day's emotional data, provide a single numerical rating from 0-100 representing overall day quality.

  Overall Mood: ${overallMood}
  Emotions Experienced: ${emotionsList ?? "None recorded"}
  Lessons/Reflections: ${learningsList}

  Consider:
  - Positive moods (Great, Good) and emotions (Happy, Excited, Grateful, Proud, Hopeful, Relaxed) suggest higher ratings
  - Negative moods (Bad, Awful) and emotions (Sad, Anxious, Angry, Frustrated, Confused, Tired) suggest lower ratings
  - The presence of learnings and self-reflection indicates growth (add bonus points)
  - Balance the intensity and frequency of emotions`;

  const rating = await generateObject({
    model: google("gemini-2.5-flash"),
    prompt,
    schema: int().min(0).max(100),
  });

  return rating;
}

export async function generateEncouragement({ memories, learnings }: { memories: string[]; learnings: string[] }) {
  // Collect positive moments
  // const positiveMoments = pastCheckIns.flatMap(checkIn => checkIn.memories.map(m => m.content)).slice(0, 10);
  // const learningsArr = pastCheckIns.flatMap(checkIn => checkIn.learnings.map(l => l.content)).slice(0, 10);

  const prompt = `You are a compassionate mental health support assistant. The user is having a difficult day and needs encouragement.
  
  Based on their history:
  ${
    memories.length > 0
      ? `\n- Some positive memories he've recorded:\n${memories.map(m => `  • ${m}`).join("\n")}`
      : ""
  }
  ${
    learnings.length > 0
      ? `\n- Important learnings he've gained:\n${learnings.map(l => `  • ${l}`).join("\n")}`
      : ""
  }
  
  Generate a warm, encouraging message (2-3 paragraphs, max 200 words) that:
  1. Acknowledges that tough days happen
  2. Reminds them of specific positive moments and growth
  3. Encourages self-compassion
  4. Ends with a gentle, hopeful note
  
  Make it personal by referencing their actual memories and learnings. Be warm but not overly cheerful.`;

  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt,
  });

  return text;
}
