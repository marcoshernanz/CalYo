import { v } from "convex/values";
import { internalAction, internalQuery } from "../_generated/server";
import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";

interface PageFoodsForCountResult {
  page: {
    _id: Id<"fdcFoods">;
    hasEmbedding: boolean | undefined;
    embeddingLen: number;
  }[];
  isDone: boolean;
  cursor: string | null;
}

export const pageFoodsForCount = internalQuery({
  args: { cursor: v.optional(v.string()), pageSize: v.number() },
  handler: async (
    ctx,
    { cursor, pageSize }
  ): Promise<PageFoodsForCountResult> => {
    const { page, isDone, continueCursor } = await ctx.db
      .query("fdcFoods")
      .paginate({ cursor: cursor ?? null, numItems: pageSize });

    const slim = page.map((doc) => ({
      _id: doc._id,
      hasEmbedding: doc.hasEmbedding,
      embeddingLen: Array.isArray(doc.embedding) ? doc.embedding.length : 0,
    }));

    return { page: slim, isDone, cursor: continueCursor };
  },
});

const countFdcEmbeddings = internalAction({
  handler: async (ctx) => {
    const pageSize = 200;
    let cursor: string | undefined = undefined;
    let total = 0;
    let embedded = 0;

    while (true) {
      const {
        page,
        isDone,
        cursor: nextCursor,
      }: PageFoodsForCountResult = await ctx.runQuery(
        internal.utils.countFdcEmbeddings.pageFoodsForCount,
        { cursor, pageSize }
      );

      total += page.length;
      for (const doc of page) {
        if (doc.hasEmbedding === true && doc.embeddingLen > 0) {
          embedded++;
        }
      }

      cursor = nextCursor ?? undefined;
      if (isDone) break;
    }

    const coverage = total === 0 ? 0 : (embedded / total) * 100;
    console.log(
      `Embedding coverage: ${embedded}/${total} (${coverage.toFixed(2)}%)`
    );
    return { embedded, total, coverage };
  },
});

export default countFdcEmbeddings;
