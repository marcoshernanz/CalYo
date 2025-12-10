type Params = {
  grams: number;
  macrosPer100g: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
};

export default function scaleMacrosPer100g({ macrosPer100g, grams }: Params) {
  const factor = grams / 100;
  return {
    calories: Math.round(macrosPer100g.calories * factor),
    protein: Math.round(macrosPer100g.protein * factor),
    fat: Math.round(macrosPer100g.fat * factor),
    carbs: Math.round(macrosPer100g.carbs * factor),
  };
}
