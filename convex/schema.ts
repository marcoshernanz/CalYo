import { authTables } from "@convex-dev/auth/server";
import { defineSchema } from "convex/server";
import { fdcFoods } from "./tables/fdcFoods";

export default defineSchema({
  ...authTables,
  fdcFoods,
});
