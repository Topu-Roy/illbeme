"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import confetti from "canvas-confetti";
import { useAtomValue } from "jotai";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LearningsStep } from "./LearningsStep";
import { MemoriesStep } from "./MemoriesStep";
import { MoodAndEmotionStep } from "./MoodAndEmotionStep";
import { SummaryStep } from "./SummaryStep";
import { emotionsAtom, learningsAtom, memoriesAtom, overallMoodAtom } from "./wizardState";

export function DailyCheckIn() {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: saveCheckIn, isPending: isCreating } = api.checkIn.createCheckIn.useMutation();
  const { mutate: updateCheckIn, isPending: isUpdating } = api.checkIn.updateCheckIn.useMutation();
  const { data: todayCheckIn } = api.checkIn.getCheckIn.useQuery({ date: new Date() });
  const [step, setStep] = useState(1);

  const overallMood = useAtomValue(overallMoodAtom);
  const learnings = useAtomValue(learningsAtom);
  const memories = useAtomValue(memoriesAtom);
  const emotions = useAtomValue(emotionsAtom);

  const handleNext = () => setStep((prev) => prev + 1);

  function handleBack() {
    if (step === 1) {
      setIsOpen(false);
    } else {
      setStep((prev) => prev - 1);
    }
  }

  function handleSubmit() {
    if (!overallMood) {
      toast.warning("Overall mood is not selected.");
      return;
    }

    if (todayCheckIn?.id) {
      updateCheckIn(
        {
          id: todayCheckIn.id,
          emotions,
          overallMood: overallMood,
          learnings: learnings.map((item) => item.content),
          memories: memories.map((item) => item.content),
        },
        {
          onSuccess: () => {
            toast.success("Updated successfully.");

            // Review tab
            setStep(5);
          },
        }
      );
    }

    saveCheckIn(
      {
        emotions,
        overallMood: overallMood,
        learnings: learnings.map((item) => item.content),
        memories: memories.map((item) => item.content),
      },
      {
        onSuccess: () => {
          toast.success("Saved successfully.");

          // Confetti
          if (overallMood === "Great" || overallMood === "Good") {
            const duration = 3000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval: ReturnType<typeof setInterval> = setInterval(function () {
              const timeLeft = animationEnd - Date.now();

              if (timeLeft <= 0) {
                return clearInterval(interval);
              }

              const particleCount = 50 * (timeLeft / duration);

              void confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
              });

              void confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
              });
            }, 250);
          }

          // Review tab
          setStep(5);
        },
      }
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-h-[90vh] gap-0 overflow-hidden overflow-y-auto p-0 sm:max-w-xl">
        <div className="border-b px-6 py-4">
          <DialogHeader>
            <DialogTitle className="text-xl">Daily Check-In</DialogTitle>
            <DialogDescription>Step {step} of 5</DialogDescription>
          </DialogHeader>
        </div>
        <div className="space-y-6 p-6">
          {step === 1 && <MoodAndEmotionStep />}
          {step === 2 && <MemoriesStep />}
          {step === 3 && <LearningsStep />}
          {step === 4 && <SummaryStep />}
        </div>

        <div className="bg-secondary/10 border-t p-6">
          <DialogFooter className="flex gap-2 sm:justify-between">
            <Button variant="ghost" onClick={handleBack}>
              {step === 1 ? "Cancel" : "Back"}
            </Button>

            {step < 4 ? (
              <Button onClick={handleNext}>Next</Button>
            ) : (
              <>
                {todayCheckIn ? (
                  <Button onClick={() => setIsOpen(false)}>Close</Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={isCreating || isUpdating}>
                    {isCreating || isUpdating ? "Generating AI rating..." : "Complete Check-In"}
                  </Button>
                )}
              </>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
