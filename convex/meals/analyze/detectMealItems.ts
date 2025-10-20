import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod/v4";
import { analyzeConfig } from "../analyzeMealPhoto";

const detectionSchema = z.object({
  items: z
    .array(
      z.object({
        name: z.string().min(1),
        grams: z.number().min(1).max(1500),
        confidence: z.number().min(0).max(1),
      })
    )
    .max(analyzeConfig.maxDetectionItems),
});

export type DetectedItem = z.infer<typeof detectionSchema>["items"][number];

interface Params {
  imageUrl: string;
}

export default async function detectMealItems({
  imageUrl,
}: Params): Promise<DetectedItem[]> {
  const { object: detected } = await generateObject({
    model: google("gemini-2.5-flash"),
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
    temperature: analyzeConfig.temperature,
  });

  return detected.items;
}
