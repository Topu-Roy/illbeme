"use client";

import { useMemo } from "react";
import { BookOpen, Calendar, Flame, Heart, Loader2, Moon } from "lucide-react";
import Link from "next/link";
import { useCheckInsQuery, useDailyCheckInQuery } from "@/hooks/useCheckIn";
import { useEncouragementQuery } from "@/hooks/useEncouragement";
import { useJournalEntriesQuery } from "@/hooks/useJournal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DashboardProps {
  onStartReflection: () => void;
}

export function Dashboard({ onStartReflection }: DashboardProps) {
  const { data: entries } = useJournalEntriesQuery({ date: new Date() });
  const { data: checkIns } = useCheckInsQuery();
  const { data: todayCheckIn } = useDailyCheckInQuery({ date: new Date() });

  const needsSupport = todayCheckIn?.data?.overallMood === "Bad" || todayCheckIn?.data?.overallMood === "Awful";

  const todayEntries = entries?.data?.filter(
    e => new Date(e.createdAt).toDateString() === new Date().toDateString()
  );

  const lastCheckIn = checkIns?.data?.[0]; // Check-ins are ordered by date desc in the action

  const streak = useMemo(() => {
    if (!checkIns?.data?.length) return 0;

    // Check-ins are already sorted by date desc from the server
    const sortedCheckIns = [...checkIns?.data];

    const uniqueDates = Array.from(new Set(sortedCheckIns.map(r => new Date(r.date).toISOString().split("T")[0])));

    if (uniqueDates.length === 0) return 0;

    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(new Date().getTime() - 86400000).toISOString().split("T")[0];
    const lastEntryDate = uniqueDates[0];

    if (lastEntryDate !== today && lastEntryDate !== yesterday) {
      return 0;
    }

    let streak = 1;
    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const current = new Date(uniqueDates[i]);
      const next = new Date(uniqueDates[i + 1]);
      const diffTime = Math.abs(current.getTime() - next.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [checkIns]);

  const getFlameColor = (streak: number) => {
    if (streak >= 7) return "text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]";
    if (streak >= 3) return "text-orange-500";
    return "text-yellow-500";
  };

  const getFlameSize = (streak: number) => {
    if (streak >= 7) return "h-8 w-8";
    if (streak >= 3) return "h-6 w-6";
    return "h-4 w-4";
  };

  return (
    <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today&apos;s Entries</CardTitle>
          <BookOpen className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todayEntries?.length ?? 0}</div>
          <p className="text-muted-foreground text-xs">Journal entries created today</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Mood</CardTitle>
          <Moon className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {todayCheckIn?.data?.overallMood ?? lastCheckIn?.overallMood ?? "—"}
          </div>
          <p className="text-muted-foreground text-xs">{todayCheckIn ? "Recorded today" : "Last recorded mood"}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Check-In Streak</CardTitle>
          <div className={`${streak > 0 ? getFlameColor(streak) : "text-muted-foreground"}`}>
            <Flame className={`${streak > 0 ? getFlameSize(streak) : "h-4 w-4"} transition-all duration-300`} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{streak}</div>
          <p className="text-muted-foreground mb-4 text-xs">Total days checked in</p>
          <Link href={"/check-ins"} className="block w-full">
            <Button variant="outline" size="sm" className="w-full">
              View Check-Ins
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="bg-primary text-primary-foreground">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-primary-foreground/90 text-sm font-medium">Daily Check-In</CardTitle>
          <Calendar className="text-primary-foreground/90 h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todayCheckIn ? "Completed" : "Pending"}</div>
          <Button variant="secondary" className="mt-4 w-full" onClick={onStartReflection}>
            {todayCheckIn ? "Review & Edit" : "Start Check-In"}
          </Button>
        </CardContent>
      </Card>

      {needsSupport && (
        <Card className="border-rose-500/20 bg-linear-to-br from-rose-500/10 to-pink-500/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Need Support?</CardTitle>
            <Heart className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">We&apos;re here</div>
            <p className="text-muted-foreground mb-4 text-xs">Let us remind you of your strength</p>

            <EncouragementDialog />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export function EncouragementDialog() {
  const { data: encouragement, isLoading } = useEncouragementQuery();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full border-rose-500/50 hover:bg-rose-500/10">
          Get Encouragement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500" />
            You&apos;re Stronger Than You Think
          </DialogTitle>
          <DialogDescription>A gentle reminder from your journey</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center space-y-3 py-8">
              <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
              <p className="text-muted-foreground text-sm">Gathering your positive moments...</p>
            </div>
          ) : (
            <div className="prose prose-sm dark:prose-invert">
              <p className="text-sm leading-relaxed whitespace-pre-line">
                {encouragement?.data ??
                  "Remember, tough days are part of life's journey. You've shown strength before, and you have it within you now. Be kind to yourself today."}
              </p>
            </div>
          )}
        </div>
        <DialogClose asChild>
          <Button>Thank you</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
