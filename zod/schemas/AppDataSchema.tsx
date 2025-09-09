import { z } from "zod";

export const AppDataSchema = z.object({}).strict().default({});

export type AppData = z.infer<typeof AppDataSchema>;
