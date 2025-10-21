import { generateObject } from "ai";
import { analyzeConfig } from "../analyzeMealPhoto";
import { DetectedItem } from "./detectMealItems";
import { Candidate } from "./searchFdcCandidates";
import { z } from "zod/v4";

const selectionSchema = z.array(
  z.object({
    inputName: z.string(),
    chosenFdcId: z.number(),
    grams: z.number().min(1).max(1500),
  })
);
function buildSelectionPrompt(
  items: DetectedItem[],
  candidatesByItem: Record<string, Candidate[]>
) {
  const lines: string[] = [];

  lines.push(
    [
      "You are matching detected foods to an FDC-like database.",
      "Input: a list of detected items with estimated grams.",
      "For each item, you get up to 3 candidate foods with per-100g macros and calories.",
      "Pick exactly one candidate per item and optionally adjust the grams to better match typical calories/macros for that food.",
      "Bias: Prefer Foundation > SR Legacy > Survey if differences are small.",
      "Keep grams within 1–1500 g and realistic.",
      "Return JSON only as per schema: chosen[{inputName, chosenFdcId, grams, confidence, rationale?}]",
    ].join("\n")
  );

  lines.push("\nDetected items:");
  for (const it of items) {
    lines.push(`- ${it.name} ~ ${it.grams} g`);
  }

  lines.push("\nCandidates per item (per 100g):");
  for (const it of items) {
    const candidates = candidatesByItem[it.name] ?? [];
    if (!candidates.length) {
      lines.push(`- ${it.name}: (no candidates)`);
      continue;
    }
    lines.push(`- ${it.name}:`);
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
  selectedItems: z.infer<typeof selectionSchema>;
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
}

export default async function selectCandidates({
  detectedItems,
  candidatesByItem,
}: Params): Promise<{ fdcId: number; grams: number }[]> {
  const selectionPrompt = buildSelectionPrompt(detectedItems, candidatesByItem);

  const { object: selectedItems } = await generateObject({
    model: analyzeConfig.candidateSelectionModel,
    schema: selectionSchema,
    prompt: selectionPrompt,
    temperature: analyzeConfig.temperature,
  });

  const finalItems = ensureSelections({
    detectedItems,
    candidatesByItem,
    selectedItems,
  });

  return finalItems;
}
