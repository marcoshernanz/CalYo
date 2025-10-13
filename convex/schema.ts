import { authTables } from "@convex-dev/auth/server";
import { defineSchema } from "convex/server";
import { fdcFoodsTable } from "./tables/fdcFoodsTable";

export default defineSchema({
  ...authTables,
  fdcFoodsTable,
});
