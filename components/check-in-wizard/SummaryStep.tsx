"use client";

import { api } from "@/trpc/react";
import { useAtomValue } from "jotai";
import { Edit2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { emotionsAtom, learningsAtom, memoriesAtom, overallMoodAtom } from "./wizardState";

export function SummaryStep() {
  const { data: todayCheckIn } = api.checkIn.getCheckIn.useQuery({ date: new Date() });
  const overallMood = useAtomValue(overallMoodAtom);
  const learnings = useAtomValue(learningsAtom);
  const memories = useAtomValue(memoriesAtom);
  const emotions = useAtomValue(emotionsAtom);

  return (
    <div className="animate-in fade-in slide-in-from-right-4 space-y-6 duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Summary</h3>
        <Button
          variant="ghost"
          size="sm"
          // onClick={handleEdit}
          className="text-muted-foreground hover:text-foreground gap-2"
        >
          <Edit2 className="h-4 w-4" />
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-secondary/30 rounded-xl border p-4">
          <span className="text-muted-foreground text-xs tracking-wider uppercase">Overall</span>
          <p className="mt-1 text-2xl font-bold">{overallMood}</p>
        </div>
      </div>

      {todayCheckIn?.overallRating ? (
        <div className="relative overflow-hidden rounded-xl border border-indigo-500/20 bg-linear-to-br from-indigo-500/10 to-purple-500/10 p-6">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <span className="mb-1 block text-sm font-medium text-indigo-600 dark:text-indigo-400">
                AI Day Rating
              </span>
              <p className="text-foreground text-4xl font-black tracking-tight">
                {todayCheckIn.overallRating}
                <span className="text-muted-foreground ml-1 text-lg font-normal">/100</span>
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/20">
              <Zap className="h-6 w-6 text-indigo-500" />
            </div>
          </div>
        </div>
      ) : null}

      <div className="space-y-4">
        <div>
          <span className="text-muted-foreground mb-2 block text-xs tracking-wider uppercase">Emotions</span>
          <div className="flex flex-wrap gap-2">
            {Object.entries(emotions)
              .filter(([, c]) => c > 0)
              .map(([e, c]) => (
                <span
                  key={e}
                  className="bg-secondary flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                >
                  {e}
                  <span className="bg-background/50 rounded-full px-1.5 text-[10px]">{c}</span>
                </span>
              ))}
            {Object.values(emotions).every((c) => c === 0) && (
              <span className="text-muted-foreground text-sm italic">None recorded</span>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <span className="text-muted-foreground mb-2 block text-xs tracking-wider uppercase">Memories</span>
            {memories.length > 0 ? (
              <ul className="space-y-1.5">
                {memories.map((item) => (
                  <li key={item.id} className="border-primary/20 border-l-2 pl-3 text-sm">
                    {item.content}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm italic">None</p>
            )}
          </div>
          <div>
            <span className="text-muted-foreground mb-2 block text-xs tracking-wider uppercase">Learnings</span>
            {learnings.length > 0 ? (
              <ul className="space-y-1.5">
                {learnings.map((item) => (
                  <li key={item.id} className="border-primary/20 border-l-2 pl-3 text-sm">
                    {item.content}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm italic">None</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
