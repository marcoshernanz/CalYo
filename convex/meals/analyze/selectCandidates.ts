import { DetectedItem } from "./detectMealItems";
import { Candidate } from "./searchFdcCandidates";

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
    lines.push(`- ${it.name} ~ ${it.grams} g (conf ${it.confidence})`);
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
        `  ${idx + 1}) fdcId=${c.fdcId} | ${c.name} | category=${c.category ?? "-"} | P=${c.nutrientsPer100g.protein}g, F=${c.nutrientsPer100g.fat}g, C=${c.nutrientsPer100g.carbs}g, kcal=${c.caloriesPer100g}`
      );
    });
  }

  return lines.join("\n");
}

function ensureSelections(
  items: DetectedItem[],
  candidatesByItem: Record<string, Candidate[]>,
  selection: z.infer<typeof selectionSchema>
) {
  const byName = new Map(
    selection.chosen.map((c) => [c.inputName.toLowerCase(), c])
  );
  const chosen: Array<{
    chosenFdcId: number;
    grams: number;
    confidence?: number;
  }> = [];

  for (const it of items) {
    const s = byName.get(it.name.toLowerCase());
    if (s) {
      chosen.push({
        inputName: it.name,
        chosenFdcId: s.chosenFdcId,
        grams: Math.max(1, Math.min(1500, Math.round(s.grams))),
        confidence: s.confidence,
      });
      continue;
    }
    // Fallback: pick top-1 candidate with original grams
    const fallback = (candidatesByItem[it.name] ?? [])[0];
    if (fallback) {
      chosen.push({
        inputName: it.name,
        chosenFdcId: fallback.fdcId,
        grams: Math.max(1, Math.min(1500, Math.round(it.grams))),
        confidence: 0.5,
      });
    }
  }

  return chosen;
}

interface Params {
  detectedItems: DetectedItem[];
  candidatesByItem: Record<string, Candidate[]>;
}

export default async function selectCandidates({
  detectedItems,
  candidatesByItem,
}: Params): Promise<{ fdcId: string; grams: number }[]> {
  // Step 3: Ask the model to pick one candidate per item and adjust grams if needed
  const selectionPrompt = buildSelectionPrompt(detectedItems, candidatesByItem);

  const { object: selection } = await generateObject({
    model: google("models/gemini-1.5-flash"),
    schema: selectionSchema,
    prompt: selectionPrompt,
    temperature: 0.1,
  });

  // Fallback: if selection failed for some item, just pick top-1 candidate
  const chosen = ensureSelections(detectedItems, candidatesByItem, selection);
}
