"use client";

import { useState } from "react";
import { Flame, Sparkles } from "lucide-react";
import Link from "next/link";
import { useCheckInsQuery, useDailyCheckInQuery } from "@/hooks/useCheckIn";
import { DailyCheckIn } from "@/components/DailyCheckIn";
import { Dashboard } from "@/components/Dashboard";
import { JournalList } from "@/components/JournalList";
import { SOSPanel } from "@/components/SOSPanel";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { data: todayCheckIn } = useDailyCheckInQuery({ date: new Date() });
  const { data: checkIns } = useCheckInsQuery();
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [sosMode, setSosMode] = useState<boolean>(false);

  const lastCheckIn = checkIns?.data?.[0]; // Ordered by date desc
  const currentMood = todayCheckIn?.data?.overallMood ?? lastCheckIn?.overallMood;
  const isSad = currentMood === "Bad" || currentMood === "Awful";

  return (
    <div className="bg-background min-h-screen p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="space-y-4 pt-8">
          <div className="flex justify-end gap-2">
            {isSad && (
              <Button
                variant="destructive"
                className="animate-in fade-in slide-in-from-top-4 gap-2 shadow-lg"
                onClick={() => setSosMode(true)}
              >
                <Flame className="h-4 w-4" />
                Burn Away Stress
              </Button>
            )}
            <Link href="/memories">
              <Button className="gap-2 bg-indigo-600 text-white shadow-lg transition-all duration-300 hover:bg-indigo-700 hover:shadow-xl">
                <Sparkles className="h-4 w-4" />
                View Memories & Learnings
              </Button>
            </Link>
          </div>
          <Dashboard onStartReflection={() => setIsCheckingIn(true)} />
        </div>

        <div className="grid h-[600px] grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="h-full lg:col-span-3">
            <JournalList />
          </div>
        </div>
      </div>

      {isCheckingIn && <DailyCheckIn />}

      <SOSPanel open={sosMode} onOpenChange={setSosMode} />
    </div>
  );
}
