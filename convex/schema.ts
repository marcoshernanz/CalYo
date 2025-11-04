import { authTables } from "@convex-dev/auth/server";
import { defineSchema } from "convex/server";
import { fdcFoods } from "./tables/fdcFoods";
import { meals } from "./tables/meals";
import { mealItems } from "./tables/mealItems";
import { profiles } from "./tables/profiles";

export default defineSchema({
  ...authTables,
  fdcFoods,
  meals,
  mealItems,
  profiles,
});
