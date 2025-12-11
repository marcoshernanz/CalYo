import { generateObject } from "ai";
import { z } from "zod/v4";
import { analyzeMealConfig } from "./analyzeMealConfig";
import { MacrosType, NutrientsType } from "../../tables/mealItems";

const scoreSchema = z.object({
  score: z.number().min(1).max(100),
});

export default async function calculateHealthScore({
  name,
  macros,
  nutrients,
}: {
  name: string;
  macros: MacrosType;
  nutrients: NutrientsType;
}): Promise<number> {
  const { object } = await generateObject({
    model: analyzeMealConfig.namingModel,
    temperature: 0,
    schema: scoreSchema,
    output: "object",
    schemaName: "HealthScore",
    schemaDescription:
      "Health score of the food (1-100) based on nutritional value.",
    system: `
      Analyze the nutritional value of the food item and assign a health score from 1 to 100.
      1 is very unhealthy (e.g., pure sugar, trans fats).
      100 is very healthy (e.g., nutrient-dense vegetables, balanced whole foods).
      
      Consider:
      - Macro balance (protein, healthy fats, complex carbs vs sugar)
      - Micronutrient density (vitamins, minerals)
      - Negative factors (excessive sodium, sugar, saturated/trans fats)
      
      Return JSON: { score }
    `,
    messages: [
      {
        role: "user",
        content: JSON.stringify({ name, macros, nutrients }),
      },
    ],
  });

  return object.score;
}
