import macrosToKcal from "@/lib/utils/macrosToKcal";

export const profilesConfig = {
  defaultTargets: {
    calories: macrosToKcal({ carbs: 200, protein: 150, fat: 80 }),
    carbs: 200,
    protein: 150,
    fat: 80,
  },
} as const;
