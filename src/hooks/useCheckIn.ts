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

export function useCreateDailyCheckInMutation() {
  return useMutation({
    mutationFn: (body: z.infer<typeof createDailyCheckInSchema>) => api.check_in.post(body),
    onSuccess: ({ data }) => {
      const formattedDate = formatDateDDMMYYYY(data ? data.date : new Date());
      void queryClient.invalidateQueries({ queryKey: ["dailyCheckIn", formattedDate] satisfies QueryKey[] });
      void queryClient.invalidateQueries({ queryKey: ["checkIns"] satisfies QueryKey[] });
    },
  });
}

export function useUpdateDailyCheckInMutation() {
  return useMutation({
    mutationFn: async (body: z.infer<typeof updateDailyCheckInSchema>) => await api.check_in.patch(body),
    onSuccess: ({ data }) => {
      const formattedDate = formatDateDDMMYYYY(data ? data.date : new Date());
      void queryClient.invalidateQueries({ queryKey: ["dailyCheckIn", formattedDate] satisfies QueryKey[] });
      void queryClient.invalidateQueries({ queryKey: ["checkIns"] satisfies QueryKey[] });
    },
  });
}
