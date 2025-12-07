type Params = {
  nutrients: {
    protein: number;
    fat: number;
    carbs: number;
  };
  grams: number;
};

export default function scaleNutrients({ nutrients, grams }: Params) {
  const factor = grams / 100;
  return {
    protein: Math.round(nutrients.protein * factor),
    fat: Math.round(nutrients.fat * factor),
    carbs: Math.round(nutrients.carbs * factor),
  };
}
