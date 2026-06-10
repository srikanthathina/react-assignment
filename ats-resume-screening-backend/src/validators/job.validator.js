import { z } from "zod";

export const createJobSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    company: z.string().min(2),
    location: z.string().optional(),
    description: z.string().min(30),
    requiredSkills: z.array(z.string().min(1)).min(1),
    minExperience: z.number().min(0).optional()
  })
});

export const updateJobSchema = z.object({
  body: z.object({
    title: z.string().min(2).optional(),
    company: z.string().min(2).optional(),
    location: z.string().optional(),
    description: z.string().min(30).optional(),
    requiredSkills: z.array(z.string().min(1)).min(1).optional(),
    minExperience: z.number().min(0).optional(),
    status: z.enum(["open", "closed"]).optional()
  })
});
