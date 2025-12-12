"use client";

import { toast } from "sonner";
import { useLearningsQuery, useLearningsTotalCountQuery } from "@/hooks/memoriesAndLearnings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LearningsTab() {
  const {
    data: learnings,
    isLoading: learningsLoading,
    error: learningsError,
    isError: learningsIsError,
  } = useLearningsQuery({ page: 0 });
  const {
    data: learningsTotalCount,
    isLoading: learningsTotalCountLoading,
    error: learningsTotalCountError,
    isError: learningsTotalCountIsError,
  } = useLearningsTotalCountQuery();

  if (learningsIsError) toast.error(learningsError?.message ?? "Failed to fetch learnings");
  if (learningsTotalCountIsError)
    toast.error(learningsTotalCountError?.message ?? "Failed to fetch learnings total count");

  if (learningsLoading) return <div>Loading...</div>;
  if (!learnings?.data) return <div>No learnings found</div>;

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {learnings.data.map(learning => (
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

      <div>{learningsTotalCountLoading ? "Loading count..." : learningsTotalCount?.data}</div>
    </>
  );
}
