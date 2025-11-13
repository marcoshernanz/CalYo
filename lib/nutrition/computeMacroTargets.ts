import { ProfileData } from "@/convex/tables/profiles";
import estimateBodyFatPercentage from "./estimateBodyFatPercentage";

type Params = {
  weight: number;
  height: number;
  age: number;
  sex: ProfileData["sex"];
  training: ProfileData["training"];
  goal: ProfileData["goal"];
  calorieTarget: number;
};

export default function computeMacroTargets({
  weight,
  height,
  age,
  sex,
  training,
  goal,
  calorieTarget,
}: Params) {
  const bfEstimate = estimateBodyFatPercentage({ weight, height, age, sex });
  const lbm = weight * (1 - bfEstimate / 100);

  let trainingBias = -0.1;
  if (training === "lifting" || training === "both") {
    trainingBias = 0.1;
  } else if (training === "cardio") {
    trainingBias = 0.0;
  }

  let basePerKgLbm = 2.0;
  if (goal === "lose") {
    basePerKgLbm = 2.2;
  } else if (goal === "gain") {
    basePerKgLbm = 1.8;
  }

  const maxProteinPerKgLbm = 2.4;
  const minProteinPerKgLbm = 1.6;
  const proteinPerKgLbm = Math.max(
    minProteinPerKgLbm,
    Math.min(maxProteinPerKgLbm, basePerKgLbm + trainingBias)
  );
  let protein = proteinPerKgLbm * lbm;

  const minFatPerKg = goal === "lose" ? 0.6 : 0.8;
  let fatPercent = 0.25;
  if (goal === "lose") {
    fatPercent = 0.2;
  } else if (goal === "gain") {
    fatPercent = 0.3;
  }

  const fatMinG = minFatPerKg * weight;
  const fatFromPercentG = (calorieTarget * fatPercent) / 9;
  let fat = Math.max(fatMinG, fatFromPercentG);

  const proteinKcal = protein * 4;
  const fatKcal = fat * 9;
  let carbKcal = calorieTarget - proteinKcal - fatKcal;

  if (carbKcal < 0) {
    fat = fatMinG;
    const fatKcalMin = fat * 9;
    carbKcal = calorieTarget - proteinKcal - fatKcalMin;

    if (carbKcal < 0) {
      protein = minProteinPerKgLbm * lbm;
      const proteinKcalMin = protein * 4;
      carbKcal = calorieTarget - proteinKcalMin - fatKcalMin;
    }
  }

  const carbs = Math.max(0, carbKcal / 4);

  return {
    protein: Math.round(protein),
    fat: Math.round(fat),
    carbs: Math.round(carbs),
  };
}
