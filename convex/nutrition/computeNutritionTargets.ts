import { Doc } from "@/convex/_generated/dataModel";
import getAge from "../../lib/utils/getAge";
import computeBmr from "../../lib/nutrition/computeBmr";
import computeCalorieTarget from "../../lib/nutrition/computeCalorieTarget";
import computeExerciseCalories from "../../lib/nutrition/computeExerciseCalories";
import computeMacroTargets from "../../lib/nutrition/computeMacroTargets";
import computeMaintenanceCalories from "../../lib/nutrition/computeMaintenanceCalories";
import getNeatMultiplier from "../../lib/nutrition/getNeatMultiplier";
import macrosToKcal from "../../lib/utils/macrosToKcal";
import { query } from "../_generated/server";
import { v } from "convex/values";

const computeNutritionTargets = query({
  args: {
    sex: v.union(v.literal("male"), v.literal("female")),
    birthDate: v.number(),
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
  handler: (ctx, args) => {
    const age = getAge(new Date(args.birthDate));
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
    const macroTargets = computeMacroTargets({
      ...args,
      age,
      calorieTarget,
    });
    const targets: Doc<"profiles">["targets"] = {
      calories: macrosToKcal(macroTargets),
      ...macroTargets,
    };
    return targets;
  },
});

export default computeNutritionTargets;
