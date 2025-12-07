"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { memoriesAtom } from "./wizardState";

export function MemoriesStep() {
  const [memoryInput, setMemoryInput] = useState<string>();
  const [memories, setMemories] = useAtom(memoriesAtom);

  function handleAddMemory() {
    if (!memoryInput) {
      toast.info("Hey, the field is empty.");
      return;
    }

    setMemories(prev => [...prev, { id: crypto.randomUUID(), content: memoryInput }]);
    setMemoryInput("");
  }

  function handleRemoveMemory({ id }: { id: string }) {
    setMemories(prev => prev.filter(item => item.id !== id));
  }

  return (
    <div className="animate-in fade-in slide-in-from-right-4 space-y-6 duration-300">
      <div className="space-y-2">
        <Label className="text-lg font-medium">Memories</Label>
        <p className="text-muted-foreground text-sm">Significant moments from today.</p>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Textarea
            value={memoryInput}
            onChange={e => setMemoryInput(e.target.value)}
            placeholder="I remember..."
            className="bg-secondary/20 focus:bg-background min-h-[100px] resize-none pr-12 transition-colors"
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAddMemory();
              }
            }}
          />
          <Button
            onClick={handleAddMemory}
            size="icon"
            className="absolute right-3 bottom-3 h-8 w-8 rounded-full shadow-sm"
            disabled={!memoryInput?.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {memories?.map(item => (
            <div
              key={item.id}
              className="group bg-secondary/50 animate-in zoom-in flex items-center gap-2 rounded-full py-1.5 pr-1 pl-3 text-sm duration-200"
            >
              <span className="max-w-[200px] truncate">{item.content}</span>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-destructive/10 hover:text-destructive h-6 w-6 rounded-full"
                onClick={() => handleRemoveMemory({ id: item.id })}
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
