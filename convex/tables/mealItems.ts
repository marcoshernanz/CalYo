import { defineTable } from "convex/server";
import { v } from "convex/values";
import { Doc } from "../_generated/dataModel";

export const macrosFields = {
  calories: v.number(),
  protein: v.number(),
  fat: v.number(),
  carbs: v.number(),
};

export const nutrientsFields = {
  carbs: v.object({
    total: v.optional(v.number()),
    net: v.optional(v.number()),
    fiber: v.optional(v.number()),
    sugar: v.optional(v.number()),
  }),
  fats: v.object({
    total: v.optional(v.number()),
    saturated: v.optional(v.number()),
    monounsaturated: v.optional(v.number()),
    polyunsaturated: v.optional(v.number()),
    trans: v.optional(v.number()),
    cholesterol: v.optional(v.number()),
  }),
  protein: v.object({
    total: v.optional(v.number()),
    leucine: v.optional(v.number()),
    isoleucine: v.optional(v.number()),
    valine: v.optional(v.number()),
    tryptophan: v.optional(v.number()),
  }),
  vitamins: v.object({
    a: v.optional(v.number()),
    b12: v.optional(v.number()),
    b9: v.optional(v.number()),
    c: v.optional(v.number()),
    d: v.optional(v.number()),
    e: v.optional(v.number()),
    k: v.optional(v.number()),
  }),
  minerals: v.object({
    sodium: v.optional(v.number()),
    potassium: v.optional(v.number()),
    magnesium: v.optional(v.number()),
    calcium: v.optional(v.number()),
    iron: v.optional(v.number()),
    zinc: v.optional(v.number()),
  }),
  other: v.object({
    water: v.optional(v.number()),
    caffeine: v.optional(v.number()),
    alcohol: v.optional(v.number()),
  }),
};

export const mealItemsFields = {
  mealId: v.id("meals"),
  foodId: v.id("foods"),
  grams: v.number(),
  macrosPer100g: v.object(macrosFields),
  nutrientsPer100g: v.object(nutrientsFields),
};

export const mealItems = defineTable(mealItemsFields).index("byMealId", [
  "mealId",
]);

export type MacrosType = Doc<"mealItems">["macrosPer100g"];
export type NutrientsType = Doc<"mealItems">["nutrientsPer100g"];
