import { NutrientsType } from "@/convex/tables/mealItems";

type Params = {
  grams: number;
  nutrientsPer100g: NutrientsType;
};

export default function scaleNutrientsPer100g({
  nutrientsPer100g,
  grams,
}: Params): NutrientsType {
  const factor = grams / 100;
  return {
    carbs: {
      total: nutrientsPer100g.carbs.total * factor,
      net: nutrientsPer100g.carbs.net * factor,
      fiber: nutrientsPer100g.carbs.fiber * factor,
      sugar: nutrientsPer100g.carbs.sugar * factor,
    },
    fats: {
      total: nutrientsPer100g.fats.total * factor,
      saturated: nutrientsPer100g.fats.saturated * factor,
      monounsaturated: nutrientsPer100g.fats.monounsaturated * factor,
      polyunsaturated: nutrientsPer100g.fats.polyunsaturated * factor,
      trans: nutrientsPer100g.fats.trans * factor,
      cholesterol: nutrientsPer100g.fats.cholesterol * factor,
    },
    protein: {
      total: nutrientsPer100g.protein.total * factor,
      leucine: nutrientsPer100g.protein.leucine * factor,
      isoleucine: nutrientsPer100g.protein.isoleucine * factor,
      valine: nutrientsPer100g.protein.valine * factor,
      tryptophan: nutrientsPer100g.protein.tryptophan * factor,
    },
    vitamins: {
      a: nutrientsPer100g.vitamins.a * factor,
      b12: nutrientsPer100g.vitamins.b12 * factor,
      b9: nutrientsPer100g.vitamins.b9 * factor,
      c: nutrientsPer100g.vitamins.c * factor,
      d: nutrientsPer100g.vitamins.d * factor,
      e: nutrientsPer100g.vitamins.e * factor,
      k: nutrientsPer100g.vitamins.k * factor,
    },
    minerals: {
      sodium: nutrientsPer100g.minerals.sodium * factor,
      potassium: nutrientsPer100g.minerals.potassium * factor,
      magnesium: nutrientsPer100g.minerals.magnesium * factor,
      calcium: nutrientsPer100g.minerals.calcium * factor,
      iron: nutrientsPer100g.minerals.iron * factor,
      zinc: nutrientsPer100g.minerals.zinc * factor,
    },
    other: {
      water: nutrientsPer100g.other.water * factor,
      caffeine: nutrientsPer100g.other.caffeine * factor,
      alcohol: nutrientsPer100g.other.alcohol * factor,
    },
  };
}
