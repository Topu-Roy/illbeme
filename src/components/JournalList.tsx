"use client";

import { useState } from "react";
import { Check, Edit2, Frown, Heart, Meh, Send, ThumbsUp, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useCreateJournalEntryMutation,
  useDeleteJournalEntryMutation,
  useJournalEntriesQuery,
  useUpdateJournalEntryMutation,
} from "@/hooks/useJournal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type Mood = "Great" | "Good" | "Okay" | "Bad" | "Awful";

const MOODS: { value: Mood; icon: React.ElementType; label: string; color: string }[] = [
  { value: "Great", icon: Heart, label: "Great", color: "text-pink-500" },
  { value: "Good", icon: ThumbsUp, label: "Good", color: "text-green-500" },
  { value: "Okay", icon: Meh, label: "Okay", color: "text-yellow-500" },
  { value: "Bad", icon: Frown, label: "Bad", color: "text-orange-500" },
  { value: "Awful", icon: Frown, label: "Awful", color: "text-red-500" },
];

export function JournalList() {
  const { data: entries } = useJournalEntriesQuery({ date: new Date() });
  const createEntry = useCreateJournalEntryMutation();
  const deleteEntry = useDeleteJournalEntryMutation();
  const updateEntry = useUpdateJournalEntryMutation();

  const [newEntry, setNewEntry] = useState("");
  const [selectedMood, setSelectedMood] = useState<Mood>("Good");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const handleSubmit = () => {
    if (!newEntry.trim()) return;
    createEntry.mutate({ content: newEntry, mood: selectedMood });
    setNewEntry("");
    setSelectedMood("Good");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const startEditing = (id: string, content: string) => {
    setEditingId(id);
    setEditContent(content);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditContent("");
  };

  const saveEdit = (id: string) => {
    if (editContent.trim()) {
      updateEntry.mutate({ id, content: editContent, mood: selectedMood });
    }
    setEditingId(null);
    setEditContent("");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      deleteEntry.mutate({ id });
    }
  };

  // Group entries by date
  const groupedEntries =
    entries?.data?.reduce(
      (groups, entry) => {
        const date = new Date(entry.createdAt).toDateString();
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(entry);
        return groups;
      },
      {} as Record<
        string,
        { id: string; createdAt: Date; content: string; mood: "Great" | "Good" | "Okay" | "Bad" | "Awful" }[]
      >
    ) ?? {};

  return (
    <div className="flex h-full flex-col space-y-6">
      <p className="text-2xl font-semibold">Add new entry</p>

      <Card className="space-y-4 p-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {MOODS.map(mood => {
            const Icon = mood.icon;
            return (
              <Button
                key={mood.value}
                variant={selectedMood === mood.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedMood(mood.value)}
                className={cn(
                  "flex items-center gap-2 transition-all",
                  selectedMood === mood.value ? "" : "hover:bg-muted"
                )}
              >
                <Icon
                  className={cn("h-4 w-4", selectedMood === mood.value ? "text-primary-foreground" : mood.color)}
                />
                {mood.label}
              </Button>
            );
          })}
        </div>
        <div className="relative">
          <Textarea
            placeholder="How are you feeling right now?"
            value={newEntry}
            onChange={e => setNewEntry(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[80px] resize-none pr-12"
          />
          <Button
            onClick={handleSubmit}
            disabled={!newEntry.trim() || createEntry.isPending}
            className="absolute right-2 bottom-2 h-8 w-8 p-0"
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <div className="flex-1 space-y-6 overflow-y-auto pr-2">
        {Object.entries(groupedEntries).map(([date, dayEntries]) => (
          <div key={date} className="space-y-4">
            <h3 className="text-muted-foreground bg-background sticky top-0 z-10 py-2 text-sm font-medium">
              {new Date(date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </h3>
            <div className="space-y-4">
              {dayEntries.map(entry => (
                <Card key={entry.id} className="group relative">
                  <CardContent className="p-4 pt-4">
                    {editingId === entry.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editContent}
                          onChange={e => setEditContent(e.target.value)}
                          className="min-h-[100px]"
                        />
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={cancelEditing}>
                            <X className="mr-1 h-4 w-4" /> Cancel
                          </Button>
                          <Button size="sm" onClick={() => saveEdit(entry.id)} disabled={updateEntry.isPending}>
                            <Check className="mr-1 h-4 w-4" /> Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              {entry.mood && (
                                <span
                                  className={cn(
                                    "bg-muted rounded-full px-2 py-0.5 text-xs font-medium",
                                    MOODS.find(m => m.value === entry.mood)?.color
                                  )}
                                >
                                  {entry.mood}
                                </span>
                              )}
                              <span className="text-muted-foreground text-xs">
                                {new Date(entry.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{entry.content}</p>
                          </div>
                        </div>
                        <div className="bg-background/80 absolute top-2 right-2 flex gap-1 rounded-md opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => startEditing(entry.id, entry.content)}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive h-6 w-6"
                            onClick={() => handleDelete(entry.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
        {entries?.data?.length === 0 && (
          <div className="text-muted-foreground py-10 text-center">No entries yet. Start writing above!</div>
        )}
      </div>
    </div>
  );
}
