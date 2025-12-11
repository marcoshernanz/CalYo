import { defineTable } from "convex/server";
import { v } from "convex/values";
import { Doc } from "../_generated/dataModel";

export const macrosFields = {
  calories: v.number(),
  protein: v.number(),
  fat: v.number(),
  carbs: v.number(),
};

export const microsFields = {
  score: v.number(),
  fiber: v.number(),
  sugar: v.number(),
  sodium: v.number(),
};

export const nutrientsFields = {
  carbs: v.object({
    total: v.number(),
    net: v.number(),
    fiber: v.number(),
    sugar: v.number(),
  }),
  fats: v.object({
    total: v.number(),
    saturated: v.number(),
    monounsaturated: v.number(),
    polyunsaturated: v.number(),
    trans: v.number(),
    cholesterol: v.number(),
  }),
  protein: v.object({
    total: v.number(),
    leucine: v.number(),
    isoleucine: v.number(),
    valine: v.number(),
    tryptophan: v.number(),
  }),
  vitamins: v.object({
    a: v.number(),
    b12: v.number(),
    b9: v.number(),
    c: v.number(),
    d: v.number(),
    e: v.number(),
    k: v.number(),
  }),
  minerals: v.object({
    sodium: v.number(),
    potassium: v.number(),
    magnesium: v.number(),
    calcium: v.number(),
    iron: v.number(),
    zinc: v.number(),
  }),
  other: v.object({
    water: v.number(),
    caffeine: v.number(),
    alcohol: v.number(),
  }),
};

export const mealItemsFields = {
  mealId: v.id("meals"),
  foodId: v.id("foods"),
  grams: v.number(),
  macrosPer100g: v.object(macrosFields),
  microsPer100g: v.object(microsFields),
  nutrientsPer100g: v.object(nutrientsFields),
};

export const mealItems = defineTable(mealItemsFields).index("byMealId", [
  "mealId",
]);

export type MacrosType = Doc<"mealItems">["macrosPer100g"];
export type MicrosType = Doc<"mealItems">["microsPer100g"];
export type NutrientsType = Doc<"mealItems">["nutrientsPer100g"];
