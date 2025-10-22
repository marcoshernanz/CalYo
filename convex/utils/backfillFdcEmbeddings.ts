import { v } from "convex/values";
import { Doc } from "../_generated/dataModel";
import {
  internalAction,
  internalMutation,
  internalQuery,
} from "../_generated/server";
import { internal } from "../_generated/api";
import { embedMany } from "ai";
import { google } from "@ai-sdk/google";
import l2Normalize from "../../lib/utils/l2Normalize";

function buildEmbeddingText(food: Doc<"fdcFoods">): string {
  const parts = [];
  parts.push(food.description.en);
  if (food.category?.en) {
    parts.push(`Category: ${food.category.en}`);
  }
  return parts.join(". ");
}

export const nextFoodsToEmbed = internalQuery({
  args: { limit: v.number() },
  handler: async (ctx, { limit }) => {
    const foods = await ctx.db
      .query("fdcFoods")
      .withIndex("byHasEmbedding", (q) => q.eq("hasEmbedding", false))
      .take(limit);

    return foods.map((food) => ({
      _id: food._id,
      text: buildEmbeddingText(food),
    }));
  },
});

export const saveEmbedding = internalMutation({
  args: {
    id: v.id("fdcFoods"),
    embedding: v.array(v.float64()),
  },
  handler: async (ctx, { id, embedding }) => {
    await ctx.db.patch(id, { embedding, hasEmbedding: true });
  },
});

const backfillFdcEmbeddings = internalAction({
  handler: async (ctx) => {
    const batchSize = 100;
    let processed = 0;
    let tokensUsed = 0;
    let batches = 0;

    while (true) {
      const batch = await ctx.runQuery(
        internal.utils.backfillFdcEmbeddings.nextFoodsToEmbed,
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
          internal.utils.backfillFdcEmbeddings.saveEmbedding,
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
