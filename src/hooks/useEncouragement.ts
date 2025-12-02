import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/eden";
import type { QueryKey } from "./types";

export function useEncouragementQuery() {
  return useQuery({
    queryKey: ["encouragement"] satisfies QueryKey[],
    queryFn: () => api.encouragement.get(),
  });
}
