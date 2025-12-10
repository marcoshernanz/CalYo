import { Doc } from "@/convex/_generated/dataModel";
import { NutrientsType } from "@/convex/tables/mealItems";

export default function getFoodNutrients(food: Doc<"foods">): NutrientsType {
  const n = food.nutrients;
  const m = food.macroNutrients;

  return {
    carbs: {
      total: m.carbs,
      net: m.carbs - (n.fiberTotalDietary ?? 0),
      fiber: n.fiberTotalDietary ?? 0,
      sugar: n.sugarsTotal ?? n.totalSugars ?? 0,
    },
    fats: {
      total: m.fat,
      saturated: n.fattyAcidsTotalSaturated ?? 0,
      monounsaturated: n.fattyAcidsTotalMonounsaturated ?? 0,
      polyunsaturated: n.fattyAcidsTotalPolyunsaturated ?? 0,
      trans: n.fattyAcidsTotalTrans ?? 0,
      cholesterol: n.cholesterol ?? 0,
    },
    protein: {
      total: m.protein,
      leucine: n.leucine ?? 0,
      isoleucine: n.isoleucine ?? 0,
      valine: n.valine ?? 0,
      tryptophan: n.tryptophan ?? 0,
    },
    vitamins: {
      a: n.vitaminARae ?? n.vitaminAIu ?? 0, // Prefer RAE
      b12: n.vitaminB12 ?? 0,
      b9: n.folateDfe ?? n.folateTotal ?? 0, // Prefer DFE
      c: n.vitaminCTotalAscorbicAcid ?? 0,
      d: n.vitaminDD2D3InternationalUnits ?? 0,
      e: n.vitaminEAlphaTocopherol ?? 0,
      k: n.vitaminKPhylloquinone ?? 0,
    },
    minerals: {
      sodium: n.sodiumNa ?? 0,
      potassium: n.potassiumK ?? 0,
      magnesium: n.magnesiumMg ?? 0,
      calcium: n.calciumCa ?? 0,
      iron: n.ironFe ?? 0,
      zinc: n.zincZn ?? 0,
    },
    other: {
      water: n.water ?? 0,
      caffeine: n.caffeine ?? 0,
      alcohol: n.alcoholEthyl ?? 0,
    },
  };
}
