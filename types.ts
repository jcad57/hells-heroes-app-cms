import z from "zod";

export const Band = z.object({
  id: z.number(),
  name: z.string(),
  show_date: z.string(),
  show_time: z.string(),
  stage: z.string(),
});

export const Stage = z.object({
  id: z.number(),
  stage_name: z.string(),
});

export const ShowDate = z.object({
  id: z.number(),
  show_date: z.string(),
});
