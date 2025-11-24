import { generateObject } from "ai";
import { analyzeMealConfig, analyzeMealPrompts } from "./analyzeMealConfig";
import { DetectedIngredient } from "./detectMealIngredients";
import { Candidate } from "./searchFdcCandidates";
import { z } from "zod/v4";

const selectionSchema = z.object({
  inputName: z.string(),
  chosenFdcId: z.number(),
  grams: z.number().int().min(1).max(1500),
});

type SelectedType = z.infer<typeof selectionSchema>;

type CandidatesByIngredient = Partial<Record<string, Candidate[]>>;

function buildCandidatesText(
  detectedIngredients: DetectedIngredient[],
  candidatesByIngredient: CandidatesByIngredient
) {
  const lines: string[] = [];

  lines.push("\nCandidates per ingredient (per 100g):");
  for (const ingredient of detectedIngredients) {
    const candidates = candidatesByIngredient[ingredient.name] ?? [];
    if (!candidates.length) {
      lines.push(`- ${ingredient.name}: (no candidates)`);
      continue;
    }
    lines.push(`- ${ingredient.name}:`);
    candidates.forEach((c, idx) => {
      lines.push(
        `  ${idx + 1}) fdcId=${c.fdcId} | name=${c.name} | category=${c.category ?? "-"} | protein=${c.nutrients.protein}g, fat=${c.nutrients.fat}g, carbs=${c.nutrients.carbs}g, kcal=${c.calories}`
      );
    });
  }

  return lines.join("\n");
}

function ensureSelections({
  detectedIngredients,
  candidatesByIngredient,
  selectedIngredients,
}: {
  detectedIngredients: DetectedIngredient[];
  candidatesByIngredient: CandidatesByIngredient;
  selectedIngredients: SelectedType[];
}) {
  const byName = new Map(
    selectedIngredients.map((ingredient) => [
      ingredient.inputName.toLowerCase(),
      ingredient,
    ])
  );
  const finalIngredients: { fdcId: number; grams: number }[] = [];

  for (const detectedIngredient of detectedIngredients) {
    const selectedIngredient = byName.get(
      detectedIngredient.name.toLowerCase()
    );
    if (selectedIngredient) {
      finalIngredients.push({
        fdcId: selectedIngredient.chosenFdcId,
        grams: Math.max(
          1,
          Math.min(1500, Math.round(selectedIngredient.grams))
        ),
      });
      continue;
    }

    const fallbackCandidate =
      candidatesByIngredient[detectedIngredient.name]?.[0];
    if (fallbackCandidate !== undefined) {
      finalIngredients.push({
        fdcId: fallbackCandidate.fdcId,
        grams: Math.max(
          1,
          Math.min(1500, Math.round(detectedIngredient.grams))
        ),
      });
    }
  }

  return finalIngredients;
}

type Params = {
  detectedIngredients: DetectedIngredient[];
  candidatesByIngredient: CandidatesByIngredient;
  imageUrl: string;
};

export default async function selectCandidates({
  detectedIngredients,
  candidatesByIngredient,
  imageUrl,
}: Params): Promise<{ fdcId: number; grams: number }[]> {
  const candidatesText = buildCandidatesText(
    detectedIngredients,
    candidatesByIngredient
  );

  const { object: selectedIngredients } = await generateObject({
    model: analyzeMealConfig.candidateSelectionModel,
    temperature: analyzeMealConfig.temperature,
    schema: selectionSchema,
    output: "array",
    schemaName: "SelectedCandidates",
    schemaDescription:
      "Mapping from detected items to FDC candidates and grams.",
    system: analyzeMealPrompts.select,
    messages: [
      {
        role: "user",
        content: [{ type: "image", image: imageUrl }],
      },
      {
        role: "assistant",
        content: [
          {
            type: "text",
            text:
              "Detected ingredients (JSON):\n" +
              JSON.stringify(detectedIngredients),
          },
        ],
      },
      {
        role: "user",
        content: candidatesText,
      },
    ],
  });

  return ensureSelections({
    detectedIngredients,
    candidatesByIngredient,
    selectedIngredients,
  });
}
