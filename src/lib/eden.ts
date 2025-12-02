import type { app } from "@/app/api/[[...slugs]]/route";
import { treaty } from "@elysiajs/eden";

// this require .api to enter /api prefix
export const api = treaty<app>("localhost:3000").api;
