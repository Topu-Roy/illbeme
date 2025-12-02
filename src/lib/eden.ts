import { treaty } from "@elysiajs/eden";
import type { app } from "../app/api/[[...slugs]]/route";

// this require .api to enter /api prefix
export const api = treaty<app>("localhost:3000").api;

// void api.post({ name: "Topu" });
// const a = await api.hello.post({ name: "Topu", age: 20 });

const res = await api.ai.generate_summary.post({ article: "Hello, world!" });
