import { z } from "zod";

export const previewParamsSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid resume id"),
    previewId: z.string().uuid("Invalid preview id").optional(),
  }),
});
