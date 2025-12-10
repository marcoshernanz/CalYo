import { Doc } from "@/convex/_generated/dataModel";
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
import scaleMacrosPer100g from "@/lib/utils/scaleMacrosPer100g";
import MealMacros from "../meal/MealMacros";

type Props = {
  name?: string;
  mealItem?: Doc<"mealItems">;
  loading: boolean;
};

export default function MealItem({ name, mealItem, loading }: Props) {
  const { scrollY, onScroll } = useScrollY();

  const macrosPer100g = mealItem?.macrosPer100g ?? {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
  };

  const totals = scaleMacrosPer100g({
    grams: mealItem?.grams ?? 0,
    macrosPer100g,
  });
  return (
    <ScreenMain edges={[]}>
      <ScreenHeader scrollY={scrollY}>
        <ScreenHeaderBackButton />
        <ScreenHeaderTitle title="Ingrediente" />
      </ScreenHeader>

      <ScreenMainScrollView
        scrollViewProps={{ onScroll }}
        safeAreaProps={{ edges: ["left", "right", "bottom"] }}
      >
        <ScreenMainTitle title={name} loading={loading} />
        <MealMacros loading={loading} macros={totals} />
      </ScreenMainScrollView>
    </ScreenMain>
  );
}
