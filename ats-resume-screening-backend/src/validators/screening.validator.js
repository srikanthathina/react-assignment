import { z } from "zod";

export const createScreeningSchema = z.object({
  body: z.object({
    resumeId: z.string().min(1),
    jobId: z.string().min(1)
  })
});
