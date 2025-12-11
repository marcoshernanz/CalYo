import { MicrosType } from "@/convex/tables/mealItems";

type Params = {
  grams: number;
  microsPer100g: MicrosType;
};

export default function scaleMicrosPer100g({
  microsPer100g,
  grams,
}: Params): MicrosType {
  const factor = grams / 100;
  return {
    score: microsPer100g.score,
    fiber: microsPer100g.fiber * factor,
    sugar: microsPer100g.sugar * factor,
    sodium: microsPer100g.sodium * factor,
  };
}
