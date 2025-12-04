"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  createJournalEntryInputSchema,
  deleteJournalEntrySchema,
  updateJournalEntryInputSchema,
} from "@/schema/journal";
import type z from "zod";
import { api } from "@/lib/eden";
import { queryClient } from "@/lib/query/query-client";
import { formatDateYYYYMMDD } from "./helpers";
import type { QueryKey } from "./types";

export function useJournalEntriesQuery({ date }: { date: Date }) {
  const formattedDate = formatDateYYYYMMDD(date);

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["journalEntries", formattedDate] satisfies QueryKey[],
    queryFn: () => api.journal.get({ query: { date: formattedDate } }),
    enabled: Boolean(date),
  });
}

export function useCreateJournalEntryMutation() {
  return useMutation({
    mutationFn: (body: z.infer<typeof createJournalEntryInputSchema>) => api.journal.post(body),
    onSuccess: ({ data }) => {
      const formattedDate = formatDateYYYYMMDD(data ? data.createdAt : new Date());
      void queryClient.invalidateQueries({ queryKey: ["journalEntries", formattedDate] satisfies QueryKey[] });
    },
  });
}

export function useDeleteJournalEntryMutation() {
  return useMutation({
    mutationFn: (body: z.infer<typeof deleteJournalEntrySchema>) => api.journal.delete(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["journalEntries"] satisfies QueryKey[] });
    },
  });
}

export function useUpdateJournalEntryMutation() {
  return useMutation({
    mutationFn: (body: z.infer<typeof updateJournalEntryInputSchema>) => api.journal.patch(body),
    onSuccess: ({ data }) => {
      const formattedDate = formatDateYYYYMMDD(data ? data.createdAt : new Date());
      void queryClient.invalidateQueries({ queryKey: ["journalEntries", formattedDate] satisfies QueryKey[] });
    },
  });
}
