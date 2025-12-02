import { authTables } from "@convex-dev/auth/server";
import { defineSchema } from "convex/server";
import { foods } from "./tables/foods";
import { meals } from "./tables/meals";
import { mealItems } from "./tables/mealItems";
import { profiles } from "./tables/profiles";
import { rateLimits } from "./tables/rateLimits";

export default defineSchema({
  ...authTables,
  foods,
  meals,
  mealItems,
  profiles,
  rateLimits,
});
