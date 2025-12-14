import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { checkInRouter } from "./routers/check-in";
import { encouragementRouter } from "./routers/encouragement";
import { journalRouter } from "./routers/journal";
import { learningRouter } from "./routers/learning";
import { memoryRouter } from "./routers/memory";

/**
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  memory: memoryRouter,
  learning: learningRouter,
  checkIn: checkInRouter,
  journal: journalRouter,
  encouragement: encouragementRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
