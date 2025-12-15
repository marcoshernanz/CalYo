import { embedMany } from "ai";
import { DetectedItem } from "./detectMealItems";
import l2Normalize from "../../../lib/utils/l2Normalize";
import { ActionCtx, internalQuery } from "../../_generated/server";
import { internal } from "../../_generated/api";
import { v } from "convex/values";
import macrosToKcal from "../../../lib/utils/macrosToKcal";
import { analyzeMealConfig } from "./analyzeMealConfig";
import { MacrosType } from "@/convex/tables/mealItems";

export type Candidate = {
  fdcId: number;
  name: string;
  category: string | null;
  macroNutrients: MacrosType;
  score: number;
};

export const mapResult = internalQuery({
  args: {
    _id: v.id("foods"),
    _score: v.number(),
  },
  handler: async (ctx, { _id, _score }): Promise<Candidate> => {
    const doc = await ctx.db.get(_id);
    if (!doc) throw new Error("Document not found");

    if (doc.identity.source !== "fdc") {
      throw new Error("Expected FDC food");
    }

    return {
      fdcId: doc.identity.id,
      name: doc.name.en,
      category: doc.category?.en ?? null,
      macroNutrients: {
        calories: macrosToKcal(doc.macroNutrients),
        ...doc.macroNutrients,
      },
      score: _score,
    };
  },
});

type Params = {
  ctx: ActionCtx;
  detectedItems: DetectedItem[];
};

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
    ctx.vectorSearch("foods", "byEmbedding", {
      vector,
      limit,
      filter: (q) => q.eq("identity.source", "fdc"),
    })
  );
  const resultsList = await Promise.all(searches);

  const candidatesByItem: Record<string, Candidate[]> = {};

  await Promise.all(
    names.map(async (name, i) => {
      const results = resultsList[i];
      const mapped: Candidate[] = await Promise.all(
        results.map((r) =>
          ctx.runQuery(internal.meals.analyze.searchFdcCandidates.mapResult, r)
        )
      );
      candidatesByItem[name] = mapped
        .sort((a, b) => b.score - a.score)
        .slice(0, analyzeMealConfig.candidatesPerItem);
    })
  );

  return candidatesByItem;
}
