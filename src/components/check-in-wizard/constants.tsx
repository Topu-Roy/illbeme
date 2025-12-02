import type { Mood } from "@/generated/prisma/enums";
import { AlertCircle, CheckCircle2, CloudRain, Coffee, Frown, Heart, Smile, ThumbsUp, Zap } from "lucide-react";
import type { Emotion } from "./types";

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

export const MOODS: { label: Mood; icon: React.ReactNode }[] = [
  { label: "Great", icon: <Heart className="h-5 w-5" /> },
  { label: "Good", icon: <ThumbsUp className="h-5 w-5" /> },
  { label: "Okay", icon: <Coffee className="h-5 w-5" /> },
  { label: "Bad", icon: <Frown className="h-5 w-5" /> },
  { label: "Awful", icon: <AlertCircle className="h-5 w-5" /> },
];

export const EMOTIONS: { label: Emotion; icon: React.ReactNode }[] = [
  { label: "Happy", icon: <Smile className="h-5 w-5" /> },
  { label: "Excited", icon: <Zap className="h-5 w-5" /> },
  { label: "Grateful", icon: <Heart className="h-5 w-5" /> },
  { label: "Relaxed", icon: <Coffee className="h-5 w-5" /> },
  { label: "Sad", icon: <CloudRain className="h-5 w-5" /> },
  { label: "Anxious", icon: <AlertCircle className="h-5 w-5" /> },
  { label: "Angry", icon: <Frown className="h-5 w-5" /> },
  { label: "Tired", icon: <MoonIcon className="h-5 w-5" /> },
  { label: "Frustrated", icon: <Frown className="h-5 w-5" /> },
  { label: "Confused", icon: <AlertCircle className="h-5 w-5" /> },
  { label: "Proud", icon: <ThumbsUp className="h-5 w-5" /> },
  { label: "Hopeful", icon: <CheckCircle2 className="h-5 w-5" /> },
];
