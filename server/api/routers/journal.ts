import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { date, enum as enum_, object, string } from "zod/v4";

const getJournalInputSchema = object({
  date: date(),
});

const createJournalEntryInputSchema = object({
  content: string().nonempty(),
  mood: enum_(["Great", "Good", "Okay", "Bad", "Awful"]),
});

const updateJournalEntryInputSchema = object({
  id: string().nonempty(),
  content: string().nonempty(),
  mood: enum_(["Great", "Good", "Okay", "Bad", "Awful"]),
});

const deleteJournalEntryInputSchema = object({
  id: string().nonempty(),
});

export const journalRouter = createTRPCRouter({
  getJournals: protectedProcedure.input(getJournalInputSchema).query(async ({ ctx, input }) => {
    const date = new Date(input.date);

    const entry = await ctx.db.journalEntry.findMany({
      where: {
        userId: ctx.user.id,
        createdAt: {
          gte: new Date(date),
          lt: new Date(date.setDate(date.getDate() + 1)), // TODO
        },
      },
      select: {
        id: true,
        content: true,
        mood: true,
        createdAt: true,
      },
    });

    return entry;
  }),

  createJournals: protectedProcedure.input(createJournalEntryInputSchema).mutation(async ({ ctx, input }) => {
    const { content, mood } = input;

    const entry = await ctx.db.journalEntry.create({
      data: {
        content,
        mood,
        userId: ctx.user.id,
      },
      select: {
        id: true,
        content: true,
        mood: true,
        createdAt: true,
      },
    });

    return entry;
  }),

  deleteJournals: protectedProcedure.input(deleteJournalEntryInputSchema).mutation(async ({ ctx, input }) => {
    const { id } = input;

    const entry = await ctx.db.journalEntry.delete({
      where: {
        id,
        userId: ctx.user.id,
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    return entry;
  }),

  updateJournals: protectedProcedure.input(updateJournalEntryInputSchema).mutation(async ({ ctx, input }) => {
    const { id, content, mood } = input;
    const today = new Date();

    const entryDate = await ctx.db.journalEntry.findFirstOrThrow({
      where: {
        id,
        userId: ctx.user.id,
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    const isEntryCreatedToday =
      entryDate.createdAt.getFullYear() === today.getFullYear() &&
      entryDate.createdAt.getMonth() === today.getMonth() &&
      entryDate.createdAt.getDate() === today.getDate();

    if (!isEntryCreatedToday) {
      throw new Error("Journal entry can only be updated the same day it was created");
    }

    const entry = await ctx.db.journalEntry.update({
      where: {
        id,
        userId: ctx.user.id,
      },
      data: {
        content,
        mood,
      },
      select: {
        id: true,
        content: true,
        mood: true,
        createdAt: true,
      },
    });

    return entry;
  }),
});
