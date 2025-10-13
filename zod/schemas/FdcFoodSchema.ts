import { z } from "zod";

export const FdcFoodSchema = z.object({
  fdcId: z.number(),
  description: z.string(),
  dataType: z.literal("Foundation"),
  publicationDate: z.string(),
  foodNutrients: z.array(
    z.object({
      number: z.string(),
      name: z.string(),
      amount: z.number(),
      unitName: z.string(),
    })
  ),
});
