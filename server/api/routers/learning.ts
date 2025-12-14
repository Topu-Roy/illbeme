import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const learningRouter = createTRPCRouter({
  getLearnings: protectedProcedure.query(async ({ ctx }) => {
    const learnings = await ctx.db.checkInLearning.findMany({
      where: {
        dailyCheckIn: {
          userId: ctx.user.id,
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
  }),

  getTotalLearningsCount: protectedProcedure.query(async ({ ctx }) => {
    const totalLearnings = await ctx.db.checkInLearning.count({
      where: {
        dailyCheckIn: {
          userId: ctx.user.id,
        },
      },
    });

    return totalLearnings;
  }),
});
