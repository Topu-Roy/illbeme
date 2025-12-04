import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/eden";
import type { QueryKey } from "./types";

export function useMemoriesAndLearningsQuery() {
  return useQuery({
    queryKey: ["memoriesAndLearnings"] satisfies QueryKey[],
    queryFn: () => api.memories_and_learnings.get(),
  });
}
