import { generateObject } from "ai";
import { z } from "zod/v4";
import { analyzeMealConfig } from "./analyzeMealConfig";

const detectionSchema = z.object({
  items: z
    .array(
      z.object({
        name: z.string().min(1),
        grams: z.number().min(1).max(1500),
      })
    )
    .max(analyzeMealConfig.maxDetectionItems),
});

export type DetectedItem = z.infer<typeof detectionSchema>["items"][number];

interface Params {
  imageUrl: string;
}

export default async function detectMealItems({
  imageUrl,
}: Params): Promise<DetectedItem[]> {
  const { object: detected } = await generateObject({
    model: analyzeMealConfig.imageProcessingModel,
    schema: detectionSchema,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: [
              "You are a nutrition assistant.",
              "Task: From this meal photo, list distinct foods (ingredients) with an estimated weight in grams.",
              "Rules:",
              "- Estimate realistic portion sizes; if unsure, pick typical serving sizes.",
              "- Include sauces or beverages only if visually clear.",
              "- Max 10 items.",
              "- Output must follow the schema: items[{name, grams, confidence}].",
            ].join("\n"),
          },
          { type: "image", image: imageUrl },
        ],
      },
    ],
    temperature: analyzeMealConfig.temperature,
  });

  return detected.items;
}
