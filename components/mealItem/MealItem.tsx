import { Doc, Id } from "@/convex/_generated/dataModel";
import {
  ScreenMain,
  ScreenMainScrollView,
  ScreenMainTitle,
} from "../ui/screen/ScreenMain";
import {
  ScreenHeader,
  ScreenHeaderBackButton,
  ScreenHeaderTitle,
} from "../ui/screen/ScreenHeader";
import useScrollY from "@/lib/hooks/reanimated/useScrollY";
import scaleMacrosPer100g from "@/lib/utils/nutrition/scaleMacrosPer100g";
import MealMacros from "../meal/MealMacros";
import SafeArea from "../ui/SafeArea";
import Carousel from "../ui/Carousel";
import MealMicros from "../meal/MealMicros";
import scaleMicrosPer100g from "@/lib/utils/nutrition/scaleMicrosPer100g";

type Props = {
  mealItemId: Id<"mealItems">;
  name?: string;
  mealItem?: Doc<"mealItems">;
  loading: boolean;
};

export default function MealItem({
  mealItemId,
  name,
  mealItem,
  loading,
}: Props) {
  const { scrollY, onScroll } = useScrollY();

  const macrosPer100g = mealItem?.macrosPer100g ?? {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
  };
  const microsPer100g = mealItem?.microsPer100g ?? {
    score: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
  };

  const totalMacros = scaleMacrosPer100g({
    grams: mealItem?.grams ?? 0,
    macrosPer100g,
  });
  const totalMicros = scaleMicrosPer100g({
    grams: mealItem?.grams ?? 0,
    microsPer100g,
  });

  return (
    <ScreenMain edges={[]}>
      <ScreenHeader scrollY={scrollY}>
        <ScreenHeaderBackButton />
        <ScreenHeaderTitle title="Ingrediente" />
      </ScreenHeader>

      <ScreenMainScrollView
        scrollViewProps={{ onScroll }}
        safeAreaProps={{ edges: [] }}
      >
        <SafeArea edges={["left", "right"]} style={{ flex: 0 }}>
          <ScreenMainTitle title={name} loading={loading} />
        </SafeArea>
        <Carousel style={{ paddingBottom: 32 }}>
          <MealMacros macros={totalMacros} loading={loading} />
          <MealMicros
            source="mealItem"
            id={mealItemId}
            micros={totalMicros}
            loading={loading}
          />
        </Carousel>
      </ScreenMainScrollView>
    </ScreenMain>
  );
}
