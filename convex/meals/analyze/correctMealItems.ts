import { generateObject } from "ai";
import { z } from "zod/v4";
import { analyzeMealConfig, analyzeMealPrompts } from "./analyzeMealConfig";
import { DetectedItem, DetectedMeal } from "./detectMealItems";
import logError from "@/lib/utils/logError";

const correctionSchema = z.object({
  mealName: z
    .string()
    .describe("Short, appetizing, generic meal name in Spanish"),
  items: z.array(
    z.object({
      name: z.string().min(1),
      grams: z.number().int().min(1).max(1500),
    })
  ),
});

type Params = {
  imageUrl: string;
  previousItems: DetectedItem[];
  correction: string;
};

export default async function correctMealItems({
  imageUrl,
  previousItems,
  correction,
}: Params): Promise<DetectedMeal> {
  try {
    const { object: detected } = await generateObject({
      model: analyzeMealConfig.imageProcessingModel,
      temperature: analyzeMealConfig.temperature,
      output: "object",
      schema: correctionSchema,
      schemaName: "CorrectedMeal",
      schemaDescription: "The revised meal name and list of ingredients.",
      system: analyzeMealPrompts.correct,
      messages: [
        {
          role: "user",
          content: [
            { type: "image", image: imageUrl },
            {
              type: "text",
              text: `Previous Items: ${JSON.stringify(previousItems)}`,
            },
            { type: "text", text: `User Correction: "${correction}"` },
          ],
        },
      ],
    });

    return detected;
  } catch (error) {
    logError("correctMealItems error", error);
    throw error;
  }
}
