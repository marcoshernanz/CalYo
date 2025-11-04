import { defineTable } from "convex/server";
import { v } from "convex/values";

export const profilesFields = {
  userId: v.id("users"),
};

export const profiles = defineTable(profilesFields);
