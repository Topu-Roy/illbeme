import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/eden";
import type { QueryKey } from "./types";

export function useMemoriesQuery({ page }: { page?: number }) {
  return useQuery({
    queryKey: ["memories"] satisfies QueryKey[],
    queryFn: () => api.memories.get(),
  });
}

export function useMemoriesTotalCountQuery() {
  return useQuery({
    queryKey: ["memories_total_count"] satisfies QueryKey[],
    queryFn: () => api.memories.get_total.get(),
  });
}

export function useLearningsQuery({ page }: { page?: number }) {
  return useQuery({
    queryKey: ["learnings"] satisfies QueryKey[],
    queryFn: () => api.learnings.get(),
  });
}

export function useLearningsTotalCountQuery() {
  return useQuery({
    queryKey: ["learnings_total_count"] satisfies QueryKey[],
    queryFn: () => api.learnings.get_total.get(),
  });
}
