"use client";

import { api } from "@/trpc/react";
import { AlertCircle, CloudRain, Heart, Meh, Smile, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MOOD_ICONS: Record<string, React.ReactNode> = {
  Great: <Heart className="h-4 w-4 text-pink-500" />,
  Good: <ThumbsUp className="h-4 w-4 text-green-500" />,
  Okay: <Meh className="h-4 w-4 text-yellow-500" />,
  Bad: <CloudRain className="h-4 w-4 text-blue-500" />,
  Awful: <AlertCircle className="h-4 w-4 text-red-500" />,
};

export default function CheckInsPage() {
  const { data: checkIns } = api.checkIn.getPaginatedCheckIn.useQuery();

  // Sort check-ins by date descending (already sorted by server, but good to ensure)
  const sortedCheckIns = [...(checkIns ?? [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="bg-background min-h-screen p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="mb-8 pt-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Check-Ins</h1>
            <p className="text-muted-foreground">A look back at your daily check-ins.</p>
          </div>
        </header>

        <div className="space-y-6">
          {sortedCheckIns.length === 0 ? (
            <div className="text-muted-foreground py-10 text-center">No check-ins recorded yet.</div>
          ) : (
            sortedCheckIns.map((checkIn) => {
              const emotions = checkIn.emotions;
              const emotionEntries = emotions.filter((item) => item.count > 0);

              return (
                <Card key={checkIn.id} className="relative">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {new Date(checkIn.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                      </CardTitle>
                      <div className="bg-secondary flex items-center gap-2 rounded-full px-2 py-1 text-xs font-medium">
                        {MOOD_ICONS[checkIn.overallMood] ?? <Smile className="h-4 w-4" />}
                        <span>{checkIn.overallMood}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    {/* Overall Assessment removed as it's not in the new schema */}

                    {emotionEntries.length > 0 && (
                      <div>
                        <span className="text-muted-foreground mb-1 block">Emotions:</span>
                        <div className="flex flex-wrap gap-1">
                          {emotionEntries.slice(0, 5).map((emotion) => (
                            <Badge key={emotion.id} variant="outline" className="text-xs">
                              {emotion.emotion} ({emotion.count})
                            </Badge>
                          ))}
                          {emotionEntries.length > 5 && (
                            <span className="text-muted-foreground self-center text-xs">
                              +{emotionEntries.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <Link href={`/check-ins/${checkIn.id}`} className="mt-4 block">
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
