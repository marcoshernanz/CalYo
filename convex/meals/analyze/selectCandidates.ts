import { generateObject } from "ai";
import { analyzeMealConfig, analyzeMealPrompts } from "./analyzeMealConfig";
import { DetectedItem } from "./detectMealItems";
import { Candidate } from "./searchFdcCandidates";
import { z } from "zod/v4";

const selectionSchema = z.object({
  inputName: z.string(),
  chosenFdcId: z.number(),
  grams: z.number().min(1).max(1500),
});

type SelectedType = z.infer<typeof selectionSchema>;

function buildCandidatesText(
  detectedItems: DetectedItem[],
  candidatesByItem: Record<string, Candidate[]>
) {
  const lines: string[] = [];

  lines.push("\nCandidates per item (per 100g):");
  for (const item of detectedItems) {
    const candidates = candidatesByItem[item.name] ?? [];
    if (!candidates.length) {
      lines.push(`- ${item.name}: (no candidates)`);
      continue;
    }
    lines.push(`- ${item.name}:`);
    candidates.forEach((c, idx) => {
      lines.push(
        `  ${idx + 1}) fdcId=${c.fdcId} | ${c.name} | category=${c.category ?? "-"} | protein=${c.nutrientsPer100g.protein}g, fat=${c.nutrientsPer100g.fat}g, carbs=${c.nutrientsPer100g.carbs}g, kcal=${c.caloriesPer100g}`
      );
    });
  }

  return lines.join("\n");
}

function ensureSelections({
  detectedItems,
  candidatesByItem,
  selectedItems,
}: {
  detectedItems: DetectedItem[];
  candidatesByItem: Record<string, Candidate[]>;
  selectedItems: SelectedType[];
}) {
  const byName = new Map(
    selectedItems.map((item) => [item.inputName.toLowerCase(), item])
  );
  const finalItems: { fdcId: number; grams: number }[] = [];

  for (const detectedItem of detectedItems) {
    const selectedItem = byName.get(detectedItem.name.toLowerCase());
    if (selectedItem) {
      finalItems.push({
        fdcId: selectedItem.chosenFdcId,
        grams: Math.max(1, Math.min(1500, Math.round(selectedItem.grams))),
      });
      continue;
    }

    const fallback = (candidatesByItem[detectedItem.name] ?? [])[0];
    if (fallback) {
      finalItems.push({
        fdcId: fallback.fdcId,
        grams: Math.max(1, Math.min(1500, Math.round(detectedItem.grams))),
      });
    }
  }

  return finalItems;
}

interface Params {
  detectedItems: DetectedItem[];
  candidatesByItem: Record<string, Candidate[]>;
  imageUrl: string;
}

export default async function selectCandidates({
  detectedItems,
  candidatesByItem,
  imageUrl,
}: Params): Promise<{ fdcId: number; grams: number }[]> {
  const candidatesText = buildCandidatesText(detectedItems, candidatesByItem);

  const { object: selectedItems } = await generateObject({
    model: analyzeMealConfig.candidateSelectionModel,
    temperature: analyzeMealConfig.temperature,
    schema: selectionSchema,
    output: "array",
    system: analyzeMealPrompts.select,
    messages: [
      {
        role: "user",
        content: [{ type: "image", image: imageUrl }],
      },
      {
        role: "assistant",
        content: [{ type: "text", text: JSON.stringify(detectedItems) }],
      },
      {
        role: "user",
        content: candidatesText,
      },
    ],
  });

  const finalItems = ensureSelections({
    detectedItems,
    candidatesByItem,
    selectedItems,
  });

  return finalItems;
}
