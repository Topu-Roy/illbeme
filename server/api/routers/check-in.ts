import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { array, date, enum as enum_, number, object, record, string } from "zod/v4";
import { generateDayRating } from "@/lib/ai-functions";

const getCheckInInputSchema = object({
  date: date(),
});

const createDailyCheckInSchema = object({
  overallMood: enum_(["Great", "Good", "Okay", "Bad", "Awful"]),
  emotions: record(string(), number()),
  learnings: array(string()).optional(),
  memories: array(string()).optional(),
});

const updateDailyCheckInSchema = object({
  id: string(),
  overallMood: enum_(["Great", "Good", "Okay", "Bad", "Awful"]),
  emotions: record(string(), number()),
  learnings: array(string()).optional(),
  memories: array(string()).optional(),
});

export const checkInRouter = createTRPCRouter({
  getCheckIn: protectedProcedure.input(getCheckInInputSchema).query(async ({ ctx, input }) => {
    const startOfDay = new Date(input.date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const checkIn = await ctx.db.dailyCheckIn.findFirst({
      where: {
        userId: ctx.user.id,
        date: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      select: {
        id: true,
        overallMood: true,
        emotions: true,
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
  }),

  getPaginatedCheckIn: protectedProcedure.query(async ({ ctx }) => {
    const checkIn = await ctx.db.dailyCheckIn.findMany({
      where: {
        userId: ctx.user.id,
      },
      select: {
        id: true,
        date: true,
        overallMood: true,
        emotions: true,
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
  }),

  createCheckIn: protectedProcedure.input(createDailyCheckInSchema).mutation(async ({ ctx, input }) => {
    const { overallMood, emotions, learnings, memories } = input;

    // Check if check-in already exists for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingCheckIn = await ctx.db.dailyCheckIn.findFirst({
      where: {
        userId: ctx.user.id,
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
      learnings,
    });

    const checkIn = await ctx.db.dailyCheckIn.create({
      data: {
        overallMood,
        emotions,
        overallRating: overallRating.object,
        userId: ctx.user.id,
        date: new Date(),
        learnings: learnings
          ? {
              create: learnings.map((content) => ({
                content,
                userId: ctx.user.id,
              })),
            }
          : undefined,
        memories: memories
          ? {
              create: memories.map((content) => ({
                content,
                userId: ctx.user.id,
              })),
            }
          : undefined,
      },
      select: {
        id: true,
        overallMood: true,
        emotions: true,
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
  }),

  updateCheckIn: protectedProcedure.input(updateDailyCheckInSchema).mutation(async ({ ctx, input }) => {
    const { id, overallMood, emotions, learnings, memories } = input;

    // Get the existing check-in
    const existingCheckIn = await ctx.db.dailyCheckIn.findUnique({
      where: { id },
      include: { learnings: true, memories: true },
    });

    if (!existingCheckIn) {
      throw new Error("Check-in not found");
    }

    if (existingCheckIn.userId !== ctx.user.id) {
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
      learnings,
    });

    // TODO: Optimize this api

    // Delete existing learnings and create new ones
    await ctx.db.checkInLearning.deleteMany({
      where: { dailyCheckInId: id },
    });

    // Delete existing memories and create new ones
    await ctx.db.checkInMemory.deleteMany({
      where: { dailyCheckInId: id },
    });

    const updatedCheckIn = await ctx.db.dailyCheckIn.update({
      where: { id },
      data: {
        overallMood,
        emotions,
        overallRating: overallRating.object,
        learnings: learnings
          ? {
              create: learnings.map((content) => ({
                content,
                userId: ctx.user.id,
              })),
            }
          : undefined,
        memories: memories
          ? {
              create: memories.map((content) => ({
                content,
                userId: ctx.user.id,
              })),
            }
          : undefined,
      },
      select: {
        id: true,
        date: true,
      },
    });

    return updatedCheckIn;
  }),
});
