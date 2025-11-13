import { defineTable } from "convex/server";
import { v } from "convex/values";
import { Doc } from "../_generated/dataModel";

export const profilesFields = {
  userId: v.id("users"),
  targets: v.object({
    calories: v.number(),
    carbs: v.number(),
    protein: v.number(),
    fat: v.number(),
  }),
  hasCompletedOnboarding: v.boolean(),
  data: v.optional(
    v.object({
      measurementSystem: v.union(v.literal("metric"), v.literal("imperial")),
      sex: v.union(v.literal("male"), v.literal("female")),
      birthDate: v.number(),
      height: v.number(),
      weight: v.number(),
      weightTrend: v.union(
        v.literal("lose"),
        v.literal("maintain"),
        v.literal("gain"),
        v.literal("unsure")
      ),
      weeklyWorkouts: v.union(
        v.literal("0-2"),
        v.literal("3-5"),
        v.literal("6+")
      ),
      activityLevel: v.union(
        v.literal("low"),
        v.literal("medium"),
        v.literal("high")
      ),
      liftingExperience: v.union(
        v.literal("none"),
        v.literal("beginner"),
        v.literal("intermediate"),
        v.literal("advanced")
      ),
      cardioExperience: v.union(
        v.literal("none"),
        v.literal("beginner"),
        v.literal("intermediate"),
        v.literal("advanced")
      ),
      goal: v.union(
        v.literal("lose"),
        v.literal("maintain"),
        v.literal("gain")
      ),
      targetWeight: v.number(),
      weightChangeRate: v.number(),
      training: v.union(
        v.literal("none"),
        v.literal("lifting"),
        v.literal("cardio"),
        v.literal("both")
      ),
      hasCreatedPlan: v.boolean(),
    })
  ),
};

export const profiles = defineTable(profilesFields).index("byUserId", [
  "userId",
]);

export type ProfileData = NonNullable<Doc<"profiles">["data"]>;
