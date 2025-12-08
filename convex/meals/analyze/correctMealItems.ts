import { generateObject } from "ai";
import { z } from "zod/v4";
import { analyzeMealConfig, analyzeMealPrompts } from "./analyzeMealConfig";
import { DetectedItem } from "./detectMealItems";
import logError from "@/lib/utils/logError";

const detectionSchema = z.object({
  name: z.string().min(1),
  grams: z.number().int().min(1).max(1500),
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
}: Params): Promise<DetectedItem[]> {
  try {
    const { object: detected } = await generateObject({
      model: analyzeMealConfig.imageProcessingModel,
      temperature: analyzeMealConfig.temperature,
      output: "array",
      schema: detectionSchema,
      schemaName: "CorrectedIngredients",
      schemaDescription: "The revised list of ingredients.",
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
