import { Doc } from "@/convex/_generated/dataModel";

const offNutrientMap: Record<string, string> = {
  proteins: "protein",
  fat: "totalLipidFat",
  carbohydrates: "carbohydrateByDifference",
  "energy-kcal": "energy",
  sugars: "sugarsTotal",
  fiber: "fiberTotalDietary",
  sodium: "sodiumNa",
  "saturated-fat": "fattyAcidsTotalSaturated",
  "trans-fat": "fattyAcidsTotalTrans",
  cholesterol: "cholesterol",
  potassium: "potassiumK",
  calcium: "calciumCa",
  iron: "ironFe",
  magnesium: "magnesiumMg",
  zinc: "zincZn",
  "vitamin-a": "vitaminAIu",
  "vitamin-c": "vitaminCTotalAscorbicAcid",
  "vitamin-d": "vitaminDD2D3",
  "vitamin-e": "vitaminEAlphaTocopherol",
  "vitamin-k": "vitaminKPhylloquinone",
  "vitamin-b1": "thiamin",
  "vitamin-b2": "riboflavin",
  "vitamin-pp": "niacin",
  "vitamin-b6": "vitaminB6",
  "vitamin-b9": "folateTotal",
  "vitamin-b12": "vitaminB12",
  alcohol: "alcoholEthyl",
  caffeine: "caffeine",
  "monounsaturated-fat": "fattyAcidsTotalMonounsaturated",
  "polyunsaturated-fat": "fattyAcidsTotalPolyunsaturated",
};

export default function offExtractNutrients(
  nutriments: Record<string, unknown>
): Doc<"foods">["nutrients"] {
  const result: Record<string, number> = {};

  for (const [key, internalKey] of Object.entries(offNutrientMap)) {
    const value100g = nutriments[`${key}_100g`];
    if (typeof value100g === "number") {
      result[internalKey] = value100g;
    }
  }

  return result;
}
