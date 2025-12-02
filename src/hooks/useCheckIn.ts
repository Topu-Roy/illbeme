"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import type { createDailyCheckInSchema, updateDailyCheckInSchema } from "@/schema/check-in";
import type z from "zod";
import { api } from "@/lib/eden";
import { queryClient } from "@/lib/query/query-client";
import { formatDateDDMMYYYY } from "./helpers";
import type { QueryKey } from "./types";

export function useCheckInsQuery() {
  return useQuery({
    queryKey: ["checkIns"] satisfies QueryKey[],
    queryFn: () => api.check_in.paginated_check_ins.get(),
  });
}

export function useDailyCheckInQuery({ date }: { date: Date }) {
  const formattedDate = formatDateDDMMYYYY(date);

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["dailyCheckIn", formattedDate] satisfies QueryKey[],
    queryFn: () => api.check_in.get({ query: { date } }),
  });
}

export function useCreateDailyCheckInMutation(props: z.infer<typeof createDailyCheckInSchema> & { date: Date }) {
  const { emotions, overallMood, learnings, lessonsLearned, memories, date } = props;
  const formattedDate = formatDateDDMMYYYY(date);

  return useMutation({
    mutationFn: async () =>
      await api.check_in.post({ emotions, overallMood, learnings, lessonsLearned, memories }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["dailyCheckIn", formattedDate] satisfies QueryKey[],
      });
      void queryClient.invalidateQueries({ queryKey: ["checkIns"] satisfies QueryKey[] });
    },
  });
}

export function useUpdateDailyCheckInMutation(props: z.infer<typeof updateDailyCheckInSchema> & { date: Date }) {
  const { id, emotions, overallMood, learnings, lessonsLearned, memories, date } = props;
  const formattedDate = formatDateDDMMYYYY(date);

  return useMutation({
    mutationFn: async () =>
      await api.check_in.patch({ id, emotions, overallMood, learnings, lessonsLearned, memories }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["dailyCheckIn", formattedDate] satisfies QueryKey[],
      });
      void queryClient.invalidateQueries({ queryKey: ["checkIns"] satisfies QueryKey[] });
    },
  });
}
