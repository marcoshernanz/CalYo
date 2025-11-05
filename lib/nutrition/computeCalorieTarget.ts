import { OnboardingValues } from "@/context/OnboardingContext";

interface Params {
  goal: OnboardingValues["goal"];
  weightChangeRate: number;
  maintenanceCalories: number;
  sex: OnboardingValues["sex"];
  bmr: number;
}

const kcalPerKg = 7700;
const minKcalMale = 1600;
const minKcalFemale = 1200;

export default function computeCalorieTarget({
  goal,
  weightChangeRate,
  maintenanceCalories,
  sex,
  bmr,
}: Params) {
  const rateKgPerWeek = goal === "maintain" ? 0 : weightChangeRate;
  const dailyDelta = rateKgPerWeek * (kcalPerKg / 7);

  const maxDeficit = maintenanceCalories * 0.3;
  const maxSurplus = maintenanceCalories * 0.2;

  let appliedDelta = 0;
  if (goal === "lose") {
    appliedDelta = Math.max(0, Math.min(dailyDelta, maxDeficit));
  } else if (goal === "gain") {
    appliedDelta = Math.max(0, Math.min(dailyDelta, maxSurplus));
  }

  let rawTargetCalories = maintenanceCalories;
  if (goal === "lose") {
    rawTargetCalories = maintenanceCalories - appliedDelta;
  } else if (goal === "gain") {
    rawTargetCalories = maintenanceCalories + appliedDelta;
  }

  const minAbsolute = sex === "male" ? minKcalMale : minKcalFemale;
  const minDynamic = bmr * 1.15;
  const targetCalories = Math.max(minAbsolute, minDynamic, rawTargetCalories);

  return targetCalories;
}
