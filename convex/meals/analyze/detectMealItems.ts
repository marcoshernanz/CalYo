import { generateObject } from "ai";
import { z } from "zod/v4";
import { analyzeMealConfig, analyzeMealPrompts } from "./analyzeMealConfig";

const detectionSchema = z.object({
  name: z.string().min(1),
  grams: z.number().int().min(1).max(1500),
});

export type DetectedItem = z.infer<typeof detectionSchema>;

type Params = {
  imageUrl: string;
};

export default async function detectMealItems({
  imageUrl,
}: Params): Promise<DetectedItem[]> {
  try {
    const { object: detected } = await generateObject({
      model: analyzeMealConfig.imageProcessingModel,
      temperature: analyzeMealConfig.temperature,
      output: "array",
      schema: detectionSchema,
      schemaName: "DetectedIngredients",
      schemaDescription:
        "Single-ingredient items with grams from a meal photo.",
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
    console.error(
      "detectMealItems error",
      error instanceof Error ? error.message : "Unknown error"
    );
    throw error;
  }
}
