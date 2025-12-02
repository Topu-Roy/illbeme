import type { Mood } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { MOODS } from "./constants";

interface MoodStepProps {
  assessment: number;
  setAssessment: (value: number) => void;
  generalMood: Mood | null;
  setGeneralMood: (mood: Mood) => void;
}

export function MoodStep({ assessment, setAssessment, generalMood, setGeneralMood }: MoodStepProps) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 space-y-8 duration-300">
      <div className="space-y-4">
        <Label className="text-lg font-medium">How was your day? ({assessment}/10)</Label>
        <div className="px-2">
          <Slider
            value={[assessment]}
            onValueChange={vals => setAssessment(vals[0])}
            min={1}
            max={10}
            step={1}
            className="cursor-pointer py-4"
          />
        </div>
        <div className="text-muted-foreground flex justify-between px-1 text-xs">
          <span>Rough</span>
          <span>Okay</span>
          <span>Great</span>
        </div>
      </div>
      <div className="space-y-4">
        <Label className="text-lg font-medium">Current Mood</Label>
        <div className="grid grid-cols-5 gap-2">
          {MOODS.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => setGeneralMood(label)}
              className={cn(
                "flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-3 transition-all duration-200 hover:scale-105",
                generalMood === label
                  ? "border-primary bg-primary/5 text-primary shadow-sm"
                  : "bg-secondary/50 hover:bg-secondary text-muted-foreground border-transparent"
              )}
            >
              <div className={cn("transition-transform", generalMood === label && "scale-110")}>{icon}</div>
              <span className="text-[10px] font-medium tracking-wide uppercase">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
