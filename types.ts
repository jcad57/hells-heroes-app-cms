import z from "zod";

export const Band = z.object({
  id: z.number(),
  name: z.string(),
  show_date: z.string(),
  show_time: z.string(),
  stage: z.string(),
});
