import { generateObject } from "ai";
import { z } from "zod/v4";
import { analyzeMealConfig, analyzeMealPrompts } from "./analyzeMealConfig";
import logError from "@/lib/utils/logError";

const detectionSchema = z.object({
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

export type DetectedMeal = z.infer<typeof detectionSchema>;
export type DetectedItem = DetectedMeal["items"][number];

type Params = {
  imageUrl: string;
};

export default async function detectMealItems({
  imageUrl,
}: Params): Promise<DetectedMeal> {
  try {
    const { object: detected } = await generateObject({
      model: analyzeMealConfig.imageProcessingModel,
      temperature: analyzeMealConfig.temperature,
      output: "object",
      schema: detectionSchema,
      schemaName: "DetectedMeal",
      schemaDescription: "Meal name and ingredients from a meal photo.",
      system: analyzeMealPrompts.detect,
      messages: [
        {
          role: "user",
          content: [{ type: "image", image: imageUrl }],
        },
      ],
    });

    return detected;
  } catch (error) {
    logError("detectMealItems error", error);
    throw error;
  }
}
