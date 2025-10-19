import { query } from "../_generated/server";

export const countFdcEmbeddings = query({
  args: {},
  handler: async (ctx) => {
    const allFoods = ctx.db.query("fdcFoods");

    let total = 0;
    let embedded = 0;

    for await (const food of allFoods) {
      total++;
      if (Array.isArray(food.embedding) && food.embedding.length === 768) {
        embedded++;
      }
    }

    const coverage =
      total > 0 ? ((embedded / total) * 100).toFixed(2) + "%" : "0%";

    console.log(`Coverage: ${coverage}`);

    return { total, embedded };
  },
});
