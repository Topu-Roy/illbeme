"use client";

import { toast } from "sonner";
import { useMemoriesQuery, useMemoriesTotalCountQuery } from "@/hooks/memoriesAndLearnings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MemoriesTab() {
  const {
    data: memories,
    isLoading: memoriesLoading,
    error: memoriesError,
    isError: memoriesIsError,
  } = useMemoriesQuery({ page: 0 });
  const {
    data: memoriesTotalCount,
    isLoading: memoriesTotalCountLoading,
    error: memoriesTotalCountError,
    isError: memoriesTotalCountIsError,
  } = useMemoriesTotalCountQuery();

  if (memoriesIsError) toast.error(memoriesError?.message ?? "Failed to fetch memories");
  if (memoriesTotalCountIsError)
    toast.error(memoriesTotalCountError?.message ?? "Failed to fetch memories total count");

  if (memoriesLoading) return <div>Loading...</div>;
  if (!memories?.data) return <div>No memories found</div>;

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {memories.data.map(memory => (
          <Card key={memory.id}>
            <CardHeader>
              <CardTitle>{`${memory.createdAt.getFullYear()}-${memory.createdAt.getMonth() + 1}-${memory.createdAt.getDate()}`}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{memory.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>{memoriesTotalCountLoading ? "Loading count..." : memoriesTotalCount?.data}</div>
    </>
  );
}
