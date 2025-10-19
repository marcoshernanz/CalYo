import { v } from "convex/values";
import { Doc, Id } from "../_generated/dataModel";
import { action, internalMutation, internalQuery } from "../_generated/server";
import { internal } from "../_generated/api";
import { embedMany } from "ai";
import { google } from "@ai-sdk/google";

function buildEmbeddingText(food: Doc<"fdcFoods">): string {
  const parts = [];
  parts.push(food.description.en);
  if (food.category?.en) {
    parts.push(`Category: ${food.category.en}`);
  }
  return parts.join(". ");
}

function l2Normalize(vector: number[]): number[] {
  const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  if (!isFinite(norm) || norm === 0) {
    return vector;
  }

  return vector.map((x) => x / norm);
}

export const nextFoodsToEmbed = internalQuery({
  args: { limit: v.number() },
  handler: async (ctx, { limit }) => {
    const nextFoods: { _id: Id<"fdcFoods">; text: string }[] = [];
    const allFoods = ctx.db.query("fdcFoods");

    for await (const food of allFoods) {
      if (!food.embedding || food.embedding.length === 0) {
        nextFoods.push({ _id: food._id, text: buildEmbeddingText(food) });
        if (nextFoods.length >= limit) break;
      }
    }

    return nextFoods;
  },
});

export const saveEmbedding = internalMutation({
  args: {
    id: v.id("fdcFoods"),
    embedding: v.array(v.float64()),
  },
  handler: async (ctx, { id, embedding }) => {
    await ctx.db.patch(id, { embedding });
  },
});

const backfillFdcEmbeddings = action({
  handler: async (ctx) => {
    const batchSize = 100;
    let processed = 0;
    let tokensUsed = 0;
    let batches = 0;

    while (true) {
      const batch = await ctx.runQuery(
        internal.fdc.backfillFdcEmbeddings.nextFoodsToEmbed,
        { limit: batchSize }
      );
      if (batch.length === 0) break;

      const { embeddings, usage } = await embedMany({
        model: google.textEmbeddingModel("gemini-embedding-001"),
        values: batch.map((b) => b.text),
        providerOptions: {
          google: {
            taskType: "RETRIEVAL_DOCUMENT",
            outputDimensionality: 768,
          },
        },
      });

      if (embeddings.length !== batch.length) {
        throw new Error("Mismatch in number of embeddings returned");
      }

      for (let i = 0; i < batch.length; i++) {
        const raw = embeddings[i];
        const normed = l2Normalize(raw);

        await ctx.runMutation(
          internal.fdc.backfillFdcEmbeddings.saveEmbedding,
          { id: batch[i]._id, embedding: normed }
        );

        processed++;
      }

      batches++;
      tokensUsed += usage.tokens;

      console.log(
        `Processed batch ${batches}, total processed: ${processed}, tokens used: ${tokensUsed}`
      );
    }

    return { processed, batches };
  },
});

export default backfillFdcEmbeddings;
