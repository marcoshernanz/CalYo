import { generateObject } from "ai";
import { z } from "zod/v4";
import { analyzeMealConfig, analyzeMealPrompts } from "./analyzeMealConfig";
import { DetectedIngredient } from "./detectMealIngredients";

const nameSchema = z.object({
  mealName: z.string().min(3).max(60),
});

function formatIngredients(ingredients: DetectedIngredient[]) {
  return ingredients.map((i) => `- ${i.name} (~${i.grams} g)`).join("\n");
}

export default async function nameMeal(
  ingredients: DetectedIngredient[]
): Promise<string> {
  const ingredientsText = formatIngredients(ingredients);

  const { object } = await generateObject({
    model: analyzeMealConfig.namingModel,
    temperature: analyzeMealConfig.temperature,
    schema: nameSchema,
    output: "object",
    schemaName: "MealName",
    schemaDescription: "Short, appetizing, generic meal name.",
    system: analyzeMealPrompts.name,
    messages: [
      {
        role: "user",
        content: [{ type: "text", text: "Ingredients:\n" + ingredientsText }],
      },
    ],
  });

  return object.mealName;
}
