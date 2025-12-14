"use client";

import { api } from "@/trpc/react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LearningsTab() {
  const {
    data: learnings,
    isLoading: learningsLoading,
    error: learningsError,
    isError: learningsIsError,
  } = api.learning.getLearnings.useQuery();
  const {
    data: learningsTotalCount,
    isLoading: learningsTotalCountLoading,
    error: learningsTotalCountError,
    isError: learningsTotalCountIsError,
  } = api.learning.getTotalLearningsCount.useQuery();

  if (learningsIsError) toast.error(learningsError?.message ?? "Failed to fetch learnings");
  if (learningsTotalCountIsError)
    toast.error(learningsTotalCountError?.message ?? "Failed to fetch learnings total count");

  if (learningsLoading) return <div>Loading...</div>;
  if (!learnings) return <div>No learnings found</div>;

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {learnings.map((learning) => (
          <Card key={learning.id}>
            <CardHeader>
              <CardTitle>{`${learning.createdAt.getFullYear()}-${learning.createdAt.getMonth() + 1}-${learning.createdAt.getDate()}`}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{learning.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>{learningsTotalCountLoading ? "Loading count..." : learningsTotalCount}</div>
    </>
  );
}
