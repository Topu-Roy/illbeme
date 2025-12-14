"use client";

import { useState } from "react";
import type { Mood } from "@/generated/prisma/client";
import type { JsonValue } from "@/generated/prisma/internal/prismaNamespace";
import { Calendar, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type MemoryCardProps = {
  checkIn: {
    date: Date;
    id: string;
    overallMood: Mood;
    emotions: JsonValue;
    lessonsLearned: string | null;
    overallRating: number;
    learnings: {
      id: string;
      content: string;
    }[];
    memories: {
      id: string;
      content: string;
    }[];
  };
};

const moodDots = {
  Great: "bg-green-500",
  Good: "bg-blue-500",
  Okay: "bg-amber-500",
  Bad: "bg-orange-500",
  Awful: "bg-red-500",
};

export function MemoryCard({ checkIn }: MemoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const moodDot = moodDots[checkIn.overallMood as keyof typeof moodDots] || moodDots.Okay;

  const emotions = checkIn.emotions as Record<string, number> | null;
  const emotionEntries = emotions ? Object.entries(emotions) : [];

  const hasLessonsLearned = checkIn.lessonsLearned && checkIn.lessonsLearned.trim().length > 0;
  const hasLearnings = checkIn.learnings && checkIn.learnings.length > 0;
  const hasContent = hasLessonsLearned ?? hasLearnings;

  if (!hasContent) return null;

  return (
    <Card
      className="group cursor-pointer overflow-hidden border bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <CardHeader className="border-b pb-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="h-4 w-4" />
            <time className="font-medium">
              {new Date(checkIn.date).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </div>
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${moodDot}`}></span>
            <span className="text-sm font-medium text-slate-700">{checkIn.overallMood}</span>
          </div>
        </div>

        {emotionEntries.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {emotionEntries.map(([emotion, intensity]) => (
              <span
                key={emotion}
                className="inline-block rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
              >
                {emotion} {intensity > 1 && `×${intensity}`}
              </span>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {hasLessonsLearned && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">
              <Lightbulb className="h-3.5 w-3.5" />
              Reflection
            </div>
            <p className={`leading-relaxed text-slate-700 ${!isExpanded && "line-clamp-3"}`}>
              {checkIn.lessonsLearned}
            </p>
          </div>
        )}

        {hasLearnings && (
          <div className="space-y-2">
            <div className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Key Learnings</div>
            <ul className={`space-y-2 ${!isExpanded && "line-clamp-3"}`}>
              {checkIn.learnings.map(learning => (
                <li key={learning.id} className="border-l-2 border-slate-200 py-1 pl-4 text-sm text-slate-700">
                  {learning.content}
                </li>
              ))}
            </ul>
          </div>
        )}

        {((hasLessonsLearned && checkIn.lessonsLearned!.length > 150) ??
          (hasLearnings && checkIn.learnings.length > 2)) && (
          <button className="pt-2 text-xs font-medium text-slate-500 transition-colors hover:text-slate-700">
            {isExpanded ? "Show less" : "Read more"}
          </button>
        )}
      </CardContent>
    </Card>
  );
}
