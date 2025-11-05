import { v } from "convex/values";
import { mutation } from "../_generated/server";
import computeBmr from "../../lib/nutrition/computeBmr";
import getNeatMultiplier from "../../lib/nutrition/getNeatMultiplier";
import computeExerciseCalories from "../../lib/nutrition/computeExerciseCalories";
import computeMaintenanceCalories from "../../lib/nutrition/computeMaintenanceCalories";
import computeCalorieTarget from "../../lib/nutrition/computeCalorieTarget";
import computeMacroTargets from "../../lib/nutrition/computeMacroTargets";
import getAge from "../../lib/utils/getAge";
import { internal } from "../_generated/api";

const updateMacroTargets = mutation({
  args: {
    sex: v.union(v.literal("male"), v.literal("female")),
    bornDate: v.number(),
    height: v.number(),
    weight: v.number(),
    activityLevel: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high")
    ),
    weeklyWorkouts: v.union(
      v.literal("0-2"),
      v.literal("3-5"),
      v.literal("6+")
    ),
    training: v.union(
      v.literal("none"),
      v.literal("lifting"),
      v.literal("cardio"),
      v.literal("both")
    ),
    goal: v.union(v.literal("lose"), v.literal("maintain"), v.literal("gain")),
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
    weightChangeRate: v.number(),
  },
  handler: async (ctx, args) => {
    try {
      const profile = await ctx.runQuery(internal.profiles.getProfile.default);
      if (!profile) throw new Error("Profile not found");

      const age = getAge(new Date(args.bornDate));

      const bmr = computeBmr({ age, ...args });
      const neatMultiplier = getNeatMultiplier({ ...args });
      const exerciseCalories = computeExerciseCalories({ ...args });

      const maintenanceCalories = computeMaintenanceCalories({
        bmr,
        neatMultiplier,
        exerciseCalories,
      });
      const calorieTarget = computeCalorieTarget({
        ...args,
        bmr,
        maintenanceCalories,
      });
      const targets = computeMacroTargets({
        ...args,
        age,
        calorieTarget,
      });

      await ctx.db.patch(profile._id, { targets });
      return targets;
    } catch (error) {
      console.error("updateMacroTargets error", error);
      throw error;
    }
  },
});

export default updateMacroTargets;
