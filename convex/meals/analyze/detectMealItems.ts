import { generateObject } from "ai";
import { z } from "zod/v4";
import { analyzeMealConfig, analyzeMealPrompts } from "./analyzeMealConfig";

const detectionSchema = z.object({
  name: z.string().min(1),
  grams: z.number().min(1).max(1500),
});

export type DetectedItem = z.infer<typeof detectionSchema>;

interface Params {
  imageUrl: string;
}

export default async function detectMealItems({
  imageUrl,
}: Params): Promise<DetectedItem[]> {
  const { object: detected } = await generateObject({
    model: analyzeMealConfig.imageProcessingModel,
    temperature: analyzeMealConfig.temperature,
    output: "array",
    schema: detectionSchema,
    messages: [
      {
        role: "system",
        content: analyzeMealPrompts.detect,
      },
      {
        role: "user",
        content: [{ type: "image", image: imageUrl }],
      },
    ],
  });

  return detected;
}
