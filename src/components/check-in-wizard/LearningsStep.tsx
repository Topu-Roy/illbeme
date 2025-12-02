import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface LearningsStepProps {
  learnings: string[];
  setLearnings: React.Dispatch<React.SetStateAction<string[]>>;
  learningInput: string;
  setLearningInput: React.Dispatch<React.SetStateAction<string>>;
  handleAddItem: (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    item: string,
    setInput: React.Dispatch<React.SetStateAction<string>>
  ) => void;
  handleRemoveItem: (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) => void;
}

export function LearningsStep({
  learnings,
  setLearnings,
  learningInput,
  setLearningInput,
  handleAddItem,
  handleRemoveItem,
}: LearningsStepProps) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 space-y-6 duration-300">
      <div className="space-y-2">
        <Label className="text-lg font-medium">Learnings</Label>
        <p className="text-muted-foreground text-sm">Key takeaways from today.</p>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Textarea
            value={learningInput}
            onChange={e => setLearningInput(e.target.value)}
            placeholder="I learned that..."
            className="bg-secondary/20 focus:bg-background min-h-[100px] resize-none pr-12 transition-colors"
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAddItem(learnings, setLearnings, learningInput, setLearningInput);
              }
            }}
          />
          <Button
            onClick={() => handleAddItem(learnings, setLearnings, learningInput, setLearningInput)}
            size="icon"
            className="absolute right-3 bottom-3 h-8 w-8 rounded-full shadow-sm"
            disabled={!learningInput.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {learnings.map((learning, index) => (
            <div
              key={index}
              className="group bg-secondary/50 animate-in zoom-in flex items-center gap-2 rounded-full py-1.5 pr-1 pl-3 text-sm duration-200"
            >
              <span className="max-w-[200px] truncate">{learning}</span>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-destructive/10 hover:text-destructive h-6 w-6 rounded-full"
                onClick={() => handleRemoveItem(learnings, setLearnings, index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
