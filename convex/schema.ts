import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  fdcFoods: defineTable({
    fdcId: v.number(), // FDC integer id
    dataType: v.union(
      v.literal("Foundation"),
      v.literal("SR Legacy"),
      v.literal("Survey")
    ), // "Foundation" | "SR Legacy" | "Survey (FNDDS)"
    description_en: v.string(), // FDC name in English
    description_es: v.optional(v.string()), // Spanish name (auto/manual)
    name_es_source: v.optional(v.string()), // "auto" | "manual"

    // Optional categorization (from FDC foodCategory/wweiaFoodCategory)
    category_en: v.optional(v.string()),
    category_es: v.optional(v.string()),

    // Selected nutrients, per 100 g (nulls allowed if missing)
    nutrients: v.object({
      energy_kcal: v.optional(v.number()), // 1008
      protein_g: v.optional(v.number()), // 1003
      fat_g: v.optional(v.number()), // 1004
      carbs_g: v.optional(v.number()), // 1005
      sugar_g: v.optional(v.number()), // 2000
      fiber_g: v.optional(v.number()), // 1079
      sodium_mg: v.optional(v.number()), // 1093
    }),

    // Optional household measures from FDC foodPortions (we can add later)
    portions: v.optional(
      v.array(
        v.object({
          measure: v.string(), // e.g. "cup", "taza", "slice"
          gramWeight: v.number(), // grams for this portion
          modifier: v.optional(v.string()), // e.g. "cooked", "raw"
        })
      )
    ),

    // Search helpers
    es_search: v.optional(v.string()), // normalized Spanish for search (lowercase, no accents)
    en_search: v.optional(v.string()), // normalized English for search
    synonyms_es: v.optional(v.array(v.string())), // optional, later

    // FDC metadata
    publicationDate: v.optional(v.string()), // ISO
    modifiedDate: v.optional(v.string()), // ISO

    // Bookkeeping
    importedAt: v.number(), // ms epoch
    updatedAt: v.number(), // ms epoch
  })
    .index("byFdcId", ["fdcId"])
    .index("byDataType", ["dataType"])
    // Fast prefix search: we’ll use a search index for “contains” matching.
    .searchIndex("search_es", {
      searchField: "es_search",
      filterFields: ["dataType"],
    })
    .searchIndex("search_en", {
      searchField: "en_search",
      filterFields: ["dataType"],
    }),

  // Raw FDC payloads (optional but helpful for reprocessing without refetching)
  fdcRaw: defineTable({
    fdcId: v.number(),
    payload: v.any(),
    dataType: v.string(),
    modifiedDate: v.optional(v.string()),
    storedAt: v.number(),
  }).index("byFdcId", ["fdcId"]),

  // Ingestion state for resumable pagination and versioning
  fdcIngestState: defineTable({
    key: v.string(), // e.g. "Foundation.page", "SR Legacy.page", "Survey (FNDDS).page"
    value: v.any(),
    updatedAt: v.number(),
  }).index("byKey", ["key"]),

  // Manual overrides for Spanish names (for later)
  foodNameOverrides: defineTable({
    fdcId: v.number(),
    description_es: v.string(),
    reason: v.optional(v.string()),
    updatedAt: v.number(),
  }).index("byFdcId", ["fdcId"]),
});
