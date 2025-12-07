"use client";

import { type Mood } from "@/generated/prisma/enums";
import { useAtom } from "jotai";
import {
  AlertCircle,
  CheckCircle2,
  CloudRain,
  Coffee,
  Frown,
  Heart,
  Minus,
  MoonIcon,
  Plus,
  Smile,
  ThumbsUp,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { emotionsAtom, overallMoodAtom, type Emotion } from "./wizardState";

const MOODS: { label: Mood; icon: React.ReactNode }[] = [
  { label: "Great", icon: <Heart className="size-5" /> },
  { label: "Good", icon: <ThumbsUp className="size-5" /> },
  { label: "Okay", icon: <Coffee className="size-5" /> },
  { label: "Bad", icon: <Frown className="size-5" /> },
  { label: "Awful", icon: <AlertCircle className="size-5" /> },
];

const EMOTIONS: { label: Emotion; icon: React.ReactNode }[] = [
  { label: "Happy", icon: <Smile className="size-5" /> },
  { label: "Excited", icon: <Zap className="size-5" /> },
  { label: "Grateful", icon: <Heart className="size-5" /> },
  { label: "Proud", icon: <ThumbsUp className="size-5" /> },
  { label: "Hopeful", icon: <CheckCircle2 className="size-5" /> },
  { label: "Relaxed", icon: <Coffee className="size-5" /> },
  { label: "Tired", icon: <MoonIcon className="size-5" /> },
  { label: "Anxious", icon: <AlertCircle className="size-5" /> },
  { label: "Frustrated", icon: <Frown className="size-5" /> },
  { label: "Confused", icon: <AlertCircle className="size-5" /> },
  { label: "Angry", icon: <Frown className="size-5" /> },
  { label: "Sad", icon: <CloudRain className="size-5" /> },
];

export function MoodAndEmotionStep() {
  const [overallMood, setOverallMood] = useAtom(overallMoodAtom);

  return (
    <div className="animate-in fade-in slide-in-from-right-4 space-y-8 duration-300">
      <div className="space-y-4">
        <Label className="text-lg font-medium">How was your day?</Label>
        <div className="grid grid-cols-5 gap-2">
          {MOODS.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => setOverallMood(label)}
              className={cn(
                "flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-3 transition-all duration-200 hover:scale-105",
                overallMood === label
                  ? "border-primary bg-primary/5 text-primary shadow-sm"
                  : "bg-secondary/50 hover:bg-secondary text-muted-foreground border-transparent"
              )}
            >
              <div className={cn("transition-transform", overallMood === label && "scale-110")}>{icon}</div>
              <span className="text-[10px] font-medium tracking-wide uppercase">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-right-4 space-y-6 duration-300">
        <div className="space-y-2">
          <Label className="text-lg font-medium">Emotions felt</Label>
          <p className="text-muted-foreground text-sm">Tap to add, tap again to increase count.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {EMOTIONS.map(item => (
            <EmotionTile key={item.label} emotion={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

type EmotionTileProps = {
  emotion: {
    label: Emotion;
    icon: React.ReactNode;
  };
};

function EmotionTile({ emotion }: EmotionTileProps) {
  const [emotions, setEmotions] = useAtom(emotionsAtom);

  function increaseEmotion() {
    setEmotions(prev => ({ ...prev, [emotion.label]: prev[emotion.label] + 1 }));
  }

  function decreaseEmotion() {
    setEmotions(prev => ({ ...prev, [emotion.label]: prev[emotion.label] === 0 ? 0 : prev[emotion.label] - 1 }));
  }

  return (
    <div className="bg-card/30 flex h-12 w-full items-center justify-between gap-2 p-2">
      <Label className="flex items-center gap-1.5">
        {emotion.icon}
        {emotion.label}
      </Label>
      <div className="flex items-center justify-center gap-2">
        <Button onClick={increaseEmotion} size={"icon"} variant={"ghost"}>
          <Plus />
        </Button>
        <Button onClick={decreaseEmotion} size={"icon"} variant={"ghost"} disabled={emotions[emotion.label] === 0}>
          <Minus />
        </Button>
      </div>
    </div>
  );
}
