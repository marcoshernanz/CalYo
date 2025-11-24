import { authTables } from "@convex-dev/auth/server";
import { defineSchema } from "convex/server";
import { foods } from "./tables/foods";
import { meals } from "./tables/meals";
import { profiles } from "./tables/profiles";

export default defineSchema({
  ...authTables,
  foods,
  meals,
  profiles,
});
