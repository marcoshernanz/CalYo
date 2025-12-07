import { generateObject } from "ai";
import { z } from "zod/v4";
import { analyzeMealConfig } from "./analyzeMealConfig";

const translationSchema = z.object({
  nameEs: z.string(),
  categoryEs: z.string().optional(),
});

export default async function translateFood({
  nameEn,
  categoryEn,
}: {
  nameEn: string;
  categoryEn?: string;
}): Promise<{ nameEs: string; categoryEs?: string }> {
  const { object } = await generateObject({
    model: analyzeMealConfig.namingModel,
    temperature: 0,
    schema: translationSchema,
    output: "object",
    schemaName: "FoodTranslation",
    schemaDescription: "Spanish translation of food name and category.",
    system: `
      Translate the food name and category (if provided) from English to Spanish.
      Keep the meaning precise for nutrition context.
      Return JSON: { nameEs, categoryEs }
    `,
    messages: [
      {
        role: "user",
        content: JSON.stringify({ nameEn, categoryEn }),
      },
    ],
  });

  return {
    nameEs: object.nameEs,
    categoryEs: object.categoryEs,
  };
}
