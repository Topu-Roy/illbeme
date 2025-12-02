"use client";

import { AlertCircle, ArrowLeft, CloudRain, Heart, Meh, Smile, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCheckInsQuery } from "@/hooks/useCheckIn";
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

export default function CheckInDetailPage() {
  const { id } = useParams();
  const { data: checkIns } = useCheckInsQuery();
  const router = useRouter();

  const checkIn = checkIns?.data?.find(r => r.id === id);

  if (!checkIn) {
    return (
      <div className="bg-background flex min-h-screen flex-col items-center justify-center space-y-4 p-8">
        <h1 className="text-2xl font-bold">Check-in not found</h1>
        <Button onClick={() => router.push("/check-ins")}>Back to Check-Ins</Button>
      </div>
    );
  }

  const emotions = checkIn.emotions as Record<string, number>;
  const emotionEntries = Object.entries(emotions).filter(([, count]) => count > 0);

  return (
    <div className="bg-background min-h-screen p-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="mb-8 flex items-center gap-4">
          <Link href="/check-ins">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {new Date(checkIn.date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </h1>
            <p className="text-muted-foreground">Daily Check-In Details</p>
          </div>
        </header>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col space-y-2">
                <span className="text-muted-foreground text-sm">General Mood</span>
                <div className="flex items-center gap-2 text-lg font-medium">
                  {MOOD_ICONS[checkIn.overallMood] ?? <Smile className="h-4 w-4" />}
                  <span>{checkIn.overallMood}</span>
                </div>
              </div>
              {/* Overall Assessment removed */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emotions Felt</CardTitle>
            </CardHeader>
            <CardContent>
              {emotionEntries.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {emotionEntries.map(([emotion, count]) => (
                    <Badge key={emotion} variant="secondary" className="px-3 py-1 text-sm">
                      {emotion} <span className="ml-2 opacity-70">x{count}</span>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">No specific emotions recorded.</p>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>What I Learned</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed whitespace-pre-wrap">
                  {checkIn.lessonsLearned ?? <span className="text-muted-foreground italic">No entry.</span>}
                </p>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <CardTitle>Key Takeaways</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {checkIn.learnings && checkIn.learnings.length > 0 ? (
                    <ul className="list-disc space-y-1 pl-5">
                      {checkIn.learnings.map((l, i: number) => (
                        <li key={i} className="leading-relaxed">
                          {l.content}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-muted-foreground italic">No entry.</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
