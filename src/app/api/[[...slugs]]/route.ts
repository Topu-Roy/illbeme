import { createDailyCheckInSchema, getDailyCheckInSchema, updateDailyCheckInSchema } from "@/schema/check-in";
import {
  createJournalEntryInputSchema,
  createJournalEntryOutputSchema,
  deleteJournalEntrySchema,
  getJournalEntryInputSchema,
  journalEntryOutputSchema,
  updateJournalEntryInputSchema,
  updateJournalEntryOutputSchema,
} from "@/schema/journal";
import { generateDayRating, generateEncouragement } from "@/server/ai-functions";
import { db } from "@/server/db";
import { logger } from "@bogeychan/elysia-logger";
import { Elysia } from "elysia";
import { string } from "zod";
import { auth } from "@/lib/auth";
import { getSession } from "@/lib/auth/server";

const app = new Elysia({ prefix: "/api" })
  //* ------------------------------- Better-Auth handler -------------------------------
  .mount(auth.handler)

  //* -------------------------------------- Logger --------------------------------------
  .use(logger({ level: "debug" }))

  // ---------------------------------- Public routes ----------------------------------
  .guard({}, app => app.get("/", "Hello Nextjs"))

  //* -------------------------------- Protected routes --------------------------------
  .guard({}, app =>
    app
      //* ---------------------------------- Auth Check ----------------------------------
      // Pass session downwards
      .resolve(async () => {
        const session = await getSession();
        return { session };
      })

      // Check if session exists
      .onBeforeHandle(({ session, set }) => {
        if (!session) {
          set.status = 401;
          throw new Error("Unauthorized");
        }
      })

      // Narrow the type (Type Safety)
      .resolve(({ session }) => ({
        session: session!, // At this point 'session' is guaranteed to exist
      }))

      //* ------------------------------------- Routes -------------------------------------

      // "/memories" Group
      .group("/memories", app =>
        app
          // "/memories" Get memories
          .get("/", async ({ session }) => {
            const memories = await db.checkInMemory.findMany({
              where: {
                dailyCheckIn: {
                  userId: session.user.id,
                },
              },
              select: {
                id: true,
                content: true,
                createdAt: true,
              },
              orderBy: {
                createdAt: "desc",
              },
              take: 10,
            });

            return memories;
          })

          // "/memories/get_total" Get total memories
          .get("/get_total", async ({ session }) => {
            const totalMemories = await db.checkInMemory.count({
              where: {
                dailyCheckIn: {
                  userId: session.user.id,
                },
              },
            });

            return totalMemories;
          })
      )

      // "/learnings" Group
      .group("/learnings", app =>
        app
          // "/learnings" Get learnings
          .get("/", async ({ session }) => {
            const learnings = await db.checkInLearning.findMany({
              where: {
                dailyCheckIn: {
                  userId: session.user.id,
                },
              },
              select: {
                id: true,
                content: true,
                createdAt: true,
              },
              orderBy: {
                createdAt: "desc",
              },
              take: 10,
            });

            return learnings;
          })

          // "/learnings/get_total" Get total learnings
          .get("/get_total", async ({ session }) => {
            const totalLearnings = await db.checkInLearning.count({
              where: {
                dailyCheckIn: {
                  userId: session.user.id,
                },
              },
            });
            return totalLearnings;
          })
      )

      // "/encouragement" Encouragement routes
      .get(
        "/encouragement",
        async ({ session }) => {
          // Fetch user's past positive check-ins, memories, and learnings
          const pastCheckIns = await db.dailyCheckIn.findMany({
            where: {
              userId: session.user.id,
              OR: [{ overallMood: "Great" }, { overallMood: "Good" }],
            },
            select: {
              memories: {
                select: {
                  content: true,
                },
              },
              learnings: {
                select: {
                  content: true,
                },
              },
            },
            orderBy: {
              date: "desc",
            },
            take: 10, // Get last 10 positive check-ins
          });

          // Collect positive moments
          const positiveMoments = pastCheckIns
            .flatMap(checkIn => checkIn.memories.map(m => m.content))
            .slice(0, 10);
          const learnings = pastCheckIns.flatMap(checkIn => checkIn.learnings.map(l => l.content)).slice(0, 10);

          const encouragement = await generateEncouragement({
            memories: positiveMoments,
            learnings,
          });

          return encouragement;
        },
        {
          response: string(),
        }
      )

      //* Check-in routes
      .group("/check_in", app =>
        app
          // "/check_in" Get daily check-in
          .get(
            "/",
            async ({ query, session }) => {
              const startOfDay = new Date(query.date);
              startOfDay.setHours(0, 0, 0, 0);
              const endOfDay = new Date(startOfDay);
              endOfDay.setDate(endOfDay.getDate() + 1);

              const checkIn = await db.dailyCheckIn.findFirst({
                where: {
                  userId: session.user.id,
                  date: {
                    gte: startOfDay,
                    lt: endOfDay,
                  },
                },
                select: {
                  id: true,
                  overallMood: true,
                  emotions: true,
                  lessonsLearned: true,
                  overallRating: true,
                  date: true,
                  learnings: {
                    select: {
                      id: true,
                      content: true,
                    },
                  },
                  memories: {
                    select: {
                      id: true,
                      content: true,
                    },
                  },
                },
              });

              return checkIn;
            },
            {
              query: getDailyCheckInSchema,
            }
          )

          // "/check_in" Create daily check-in
          .post(
            "/",
            async ({ body, session }) => {
              const { overallMood, emotions, lessonsLearned, learnings, memories } = body;

              // Check if check-in already exists for today
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const tomorrow = new Date(today);
              tomorrow.setDate(tomorrow.getDate() + 1);

              const existingCheckIn = await db.dailyCheckIn.findFirst({
                where: {
                  userId: session.user.id,
                  date: {
                    gte: today,
                    lt: tomorrow,
                  },
                },
              });

              if (existingCheckIn) {
                throw new Error("Check-in already exists for today");
              }

              // Generate AI rating
              const overallRating = await generateDayRating({
                overallMood,
                emotions,
                lessonsLearned,
                learnings,
              });

              const checkIn = await db.dailyCheckIn.create({
                data: {
                  overallMood,
                  emotions,
                  lessonsLearned,
                  overallRating: overallRating.object,
                  userId: session.user.id,
                  date: new Date(),
                  learnings: learnings
                    ? {
                        create: learnings.map(content => ({
                          content,
                          userId: session.user.id,
                        })),
                      }
                    : undefined,
                  memories: memories
                    ? {
                        create: memories.map(content => ({
                          content,
                          userId: session.user.id,
                        })),
                      }
                    : undefined,
                },
                select: {
                  id: true,
                  overallMood: true,
                  emotions: true,
                  lessonsLearned: true,
                  overallRating: true,
                  date: true,
                  learnings: {
                    select: {
                      id: true,
                      content: true,
                    },
                  },
                  memories: {
                    select: {
                      id: true,
                      content: true,
                    },
                  },
                },
              });

              return checkIn;
            },
            {
              body: createDailyCheckInSchema,
              // TODO: Add response schema
            }
          )

          // "/check_in" Update daily check-in
          .patch(
            "/",
            async ({ body, session }) => {
              const { id, overallMood, emotions, lessonsLearned, learnings, memories } = body;

              // Get the existing check-in
              const existingCheckIn = await db.dailyCheckIn.findUnique({
                where: { id },
                include: { learnings: true, memories: true },
              });

              if (!existingCheckIn) {
                throw new Error("Check-in not found");
              }

              if (existingCheckIn.userId !== session.user.id) {
                throw new Error("Unauthorized");
              }

              // Check if the check-in date is today
              const checkInDate = new Date(existingCheckIn.date);
              checkInDate.setHours(0, 0, 0, 0);
              const today = new Date();
              today.setHours(0, 0, 0, 0);

              if (checkInDate.getTime() !== today.getTime()) {
                throw new Error("Can only edit today's check-in");
              }

              // Regenerate AI rating with updated data
              const overallRating = await generateDayRating({
                overallMood,
                emotions,
                lessonsLearned,
                learnings,
              });

              // Delete existing learnings and create new ones
              await db.checkInLearning.deleteMany({
                where: { dailyCheckInId: id },
              });

              // Delete existing memories and create new ones
              await db.checkInMemory.deleteMany({
                where: { dailyCheckInId: id },
              });

              const updatedCheckIn = await db.dailyCheckIn.update({
                where: { id },
                data: {
                  overallMood,
                  emotions,
                  lessonsLearned,
                  overallRating: overallRating.object,
                  learnings: learnings
                    ? {
                        create: learnings.map(content => ({
                          content,
                          userId: session.user.id,
                        })),
                      }
                    : undefined,
                  memories: memories
                    ? {
                        create: memories.map(content => ({
                          content,
                          userId: session.user.id,
                        })),
                      }
                    : undefined,
                },
                include: {
                  learnings: true,
                  memories: true,
                },
              });

              return updatedCheckIn;
            },
            {
              body: updateDailyCheckInSchema,
              // TODO: Add response schema
            }
          )

          // "/check_in/paginated_check_ins" Get paginated check-in // TODO: Pagination
          .get("/paginated_check_ins", async ({ session }) => {
            const checkIn = await db.dailyCheckIn.findMany({
              where: {
                userId: session.user.id,
              },
              select: {
                id: true,
                date: true,
                overallMood: true,
                emotions: true,
                lessonsLearned: true,
                overallRating: true,
                learnings: {
                  select: {
                    id: true,
                    content: true,
                  },
                },
                memories: {
                  select: {
                    id: true,
                    content: true,
                  },
                },
              },
              take: 10,
              orderBy: {
                date: "desc",
              },
            });

            return checkIn;
          })
      )

      //* Journal routes
      .group("/journal", app =>
        app
          // "/journal" Get journal entry
          .get(
            "/",
            async ({ query, session }) => {
              const date = new Date(query.date);

              const entry = await db.journalEntry.findMany({
                where: {
                  userId: session.user.id,
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
            },
            {
              query: getJournalEntryInputSchema,
              response: journalEntryOutputSchema,
            }
          )

          // "/journal" Create journal entry
          .post(
            "/",
            async ({ body, session }) => {
              const { content, mood } = body;

              const entry = await db.journalEntry.create({
                data: {
                  content,
                  mood,
                  userId: session.user.id,
                },
                select: {
                  id: true,
                  content: true,
                  mood: true,
                  createdAt: true,
                },
              });

              return entry;
            },
            {
              body: createJournalEntryInputSchema,
              response: createJournalEntryOutputSchema,
            }
          )

          // "/journal" Delete journal entry
          .delete(
            "/",
            async ({ body, session }) => {
              const { id } = body;

              const entry = await db.journalEntry.delete({
                where: {
                  id,
                  userId: session.user.id,
                },
                select: {
                  id: true,
                  createdAt: true,
                },
              });

              return entry;
            },
            {
              body: deleteJournalEntrySchema,
              response: deleteJournalEntrySchema,
            }
          )

          // "/journal" Update journal entry
          .patch(
            "/",
            async ({ body, session }) => {
              const { id, content, mood } = body;
              const today = new Date();

              const entryDate = await db.journalEntry.findFirstOrThrow({
                where: {
                  id,
                  userId: session.user.id,
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

              const entry = await db.journalEntry.update({
                where: {
                  id,
                  userId: session.user.id,
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
            },
            {
              body: updateJournalEntryInputSchema,
              response: updateJournalEntryOutputSchema,
            }
          )
      )
  );

export const GET = app.fetch;
export const POST = app.fetch;

export type app = typeof app;
