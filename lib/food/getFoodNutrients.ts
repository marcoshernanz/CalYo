import { Doc } from "@/convex/_generated/dataModel";
import { NutrientsType } from "@/convex/tables/mealItems";

export default function getFoodNutrients(food: Doc<"foods">): NutrientsType {
  const n = food.nutrients;
  const m = food.macroNutrients;

  return {
    carbs: {
      total: m.carbs,
      net: m.carbs - (n.fiberTotalDietary ?? 0),
      fiber: n.fiberTotalDietary,
      sugar: n.sugarsTotal ?? n.totalSugars,
    },
    fats: {
      total: m.fat,
      saturated: n.fattyAcidsTotalSaturated,
      monounsaturated: n.fattyAcidsTotalMonounsaturated,
      polyunsaturated: n.fattyAcidsTotalPolyunsaturated,
      trans: n.fattyAcidsTotalTrans,
      cholesterol: n.cholesterol,
    },
    protein: {
      total: m.protein,
      leucine: n.leucine,
      isoleucine: n.isoleucine,
      valine: n.valine,
      tryptophan: n.tryptophan,
    },
    vitamins: {
      a: n.vitaminARae ?? n.vitaminAIu, // Prefer RAE
      b12: n.vitaminB12,
      b9: n.folateDfe ?? n.folateTotal, // Prefer DFE
      c: n.vitaminCTotalAscorbicAcid,
      d: n.vitaminDD2D3InternationalUnits,
      e: n.vitaminEAlphaTocopherol,
      k: n.vitaminKPhylloquinone,
    },
    minerals: {
      sodium: n.sodiumNa,
      potassium: n.potassiumK,
      magnesium: n.magnesiumMg,
      calcium: n.calciumCa,
      iron: n.ironFe,
      zinc: n.zincZn,
    },
    other: {
      water: n.water,
      caffeine: n.caffeine,
      alcohol: n.alcoholEthyl,
    },
  };
}
