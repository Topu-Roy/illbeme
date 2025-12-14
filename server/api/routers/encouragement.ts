import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { generateEncouragement } from "@/lib/ai-functions";

export const encouragementRouter = createTRPCRouter({
  getEncouragement: protectedProcedure.query(async ({ ctx }) => {
    // Fetch user's past positive check-ins, memories, and learnings
    const pastCheckIns = await ctx.db.dailyCheckIn.findMany({
      where: {
        userId: ctx.user.id,
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
    const positiveMoments = pastCheckIns.flatMap((checkIn) => checkIn.memories.map((m) => m.content)).slice(0, 10);
    const learnings = pastCheckIns.flatMap((checkIn) => checkIn.learnings.map((l) => l.content)).slice(0, 10);

    const encouragement = await generateEncouragement({
      memories: positiveMoments,
      learnings,
    });

    return encouragement;
  }),
});
