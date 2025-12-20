type OffNutriments = {
  proteins_100g?: number;
  fat_100g?: number;
  carbohydrates_100g?: number;
  [key: string]: unknown;
};

export default function offExtractMacros(nutriments: Record<string, unknown>) {
  const typedNutriments = nutriments as OffNutriments;
  const protein = typedNutriments.proteins_100g;
  const fat = typedNutriments.fat_100g;
  const carbs = typedNutriments.carbohydrates_100g;

  return {
    protein: typeof protein === "number" ? protein : 0,
    fat: typeof fat === "number" ? fat : 0,
    carbs: typeof carbs === "number" ? carbs : 0,
  };
}
