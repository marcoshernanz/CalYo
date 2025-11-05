import { embedMany } from "ai";
import { DetectedItem } from "./detectMealItems";
import l2Normalize from "../../../lib/utils/l2Normalize";
import { ActionCtx, internalQuery } from "../../_generated/server";
import { internal } from "../../_generated/api";
import { v } from "convex/values";
import macrosToKcal from "../../../lib/utils/macrosToKcal";
import { analyzeMealConfig } from "./analyzeMealConfig";

export interface Candidate {
  fdcId: number;
  name: string;
  category: string | null;
  nutrientsPer100g: { protein: number; fat: number; carbs: number };
  caloriesPer100g: number;
  score: number;
}

export const mapResult = internalQuery({
  args: {
    _id: v.id("fdcFoods"),
    _score: v.number(),
  },
  handler: async (ctx, { _id, _score }): Promise<Candidate> => {
    const doc = await ctx.db.get(_id);
    if (!doc) throw new Error("Document not found");

    return {
      fdcId: doc.fdcId,
      name: doc.description.en,
      category: doc.category?.en ?? null,
      nutrientsPer100g: {
        protein: doc.nutrients.protein,
        fat: doc.nutrients.fat,
        carbs: doc.nutrients.carbs,
      },
      caloriesPer100g: macrosToKcal(doc.nutrients),
      score: _score,
    };
  },
});

interface Params {
  ctx: ActionCtx;
  detectedItems: DetectedItem[];
}

export default async function searchFdcCandidates({
  ctx,
  detectedItems,
}: Params): Promise<Record<string, Candidate[]>> {
  const names = detectedItems.map((item) => item.name);

  const { embeddings } = await embedMany({
    model: analyzeMealConfig.embeddingsModel,
    values: names,
    providerOptions: {
      google: { taskType: "RETRIEVAL_QUERY", outputDimensionality: 768 },
    },
  });
  const vectors = embeddings.map((e) => l2Normalize(e));

  const limit = analyzeMealConfig.candidatesPerItem * 2;
  const searches = vectors.map((vector) =>
    ctx.vectorSearch("fdcFoods", "byEmbedding", { vector, limit })
  );
  const resultsList = await Promise.all(searches);

  const candidatesByItem: Record<string, Candidate[]> = {};
  for (let i = 0; i < names.length; i++) {
    const results = resultsList[i];
    const mapped: Candidate[] = await Promise.all(
      results.map((r) =>
        ctx.runQuery(internal.meals.analyze.searchFdcCandidates.mapResult, r)
      )
    );
    candidatesByItem[names[i]] = mapped
      .sort((a, b) => b.score - a.score)
      .slice(0, analyzeMealConfig.candidatesPerItem);
  }
  return candidatesByItem;
}
