import { generateObject, ModelMessage } from "ai";
import { analyzeMealConfig, analyzeMealPrompts } from "./analyzeMealConfig";
import { DetectedItem } from "./detectMealItems";
import { Candidate } from "./searchFdcCandidates";
import { z } from "zod/v4";

const selectionSchema = z.object({
  inputName: z.string(),
  chosenFdcId: z.number(),
  grams: z.number().int().min(1).max(1500),
});

type SelectedType = z.infer<typeof selectionSchema>;

type CandidatesByItem = Partial<Record<string, Candidate[]>>;

function buildCandidatesText(
  detectedItems: DetectedItem[],
  candidatesByItem: CandidatesByItem
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
        `  (${idx + 1}) fdcId=${c.fdcId} | name=${c.name} | category=${c.category ?? "-"} | protein=${c.macroNutrients.protein}g, fat=${c.macroNutrients.fat}g, carbs=${c.macroNutrients.carbs}g, kcal=${c.macroNutrients.calories}`
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
  candidatesByItem: CandidatesByItem;
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

    const fallbackCandidate = candidatesByItem[detectedItem.name]?.[0];
    if (fallbackCandidate !== undefined) {
      finalItems.push({
        fdcId: fallbackCandidate.fdcId,
        grams: Math.max(1, Math.min(1500, Math.round(detectedItem.grams))),
      });
    }
  }

  return finalItems;
}

type Params = {
  detectedItems: DetectedItem[];
  candidatesByItem: CandidatesByItem;
  imageUrl?: string;
};

export default async function selectCandidates({
  detectedItems,
  candidatesByItem,
  imageUrl,
}: Params): Promise<{ fdcId: number; grams: number }[]> {
  const candidatesText = buildCandidatesText(detectedItems, candidatesByItem);

  const messages: ModelMessage[] = [];

  if (imageUrl) {
    messages.push({
      role: "user",
      content: [{ type: "image", image: imageUrl }],
    });
  }

  messages.push(
    {
      role: "assistant",
      content: [
        {
          type: "text",
          text: "Detected items (JSON):\n" + JSON.stringify(detectedItems),
        },
      ],
    },
    {
      role: "user",
      content: candidatesText,
    }
  );

  const { object: selectedItems } = await generateObject({
    model: analyzeMealConfig.candidateSelectionModel,
    temperature: analyzeMealConfig.temperature,
    schema: selectionSchema,
    output: "array",
    schemaName: "SelectedCandidates",
    schemaDescription:
      "Mapping from detected items to FDC candidates and grams.",
    system: analyzeMealPrompts.select,
    messages,
  });

  return ensureSelections({ detectedItems, candidatesByItem, selectedItems });
}
