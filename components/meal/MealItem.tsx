import { Doc } from "@/convex/_generated/dataModel";
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import MealMacros from "./MealMacros";
import macrosToKcal from "@/lib/utils/macrosToKcal";
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

type Props = {
  name?: string;
  mealItem?: Doc<"mealItems">;
  loading: boolean;
};

export default function MealItem({ name, mealItem, loading }: Props) {
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const carbs = mealItem?.nutrients?.carbs ?? 0;
  const protein = mealItem?.nutrients?.protein ?? 0;
  const fat = mealItem?.nutrients?.fat ?? 0;
  const calories = macrosToKcal({ carbs, protein, fat });
  const totals = { calories, carbs, protein, fat };

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
        <MealMacros loading={loading} totals={totals} />
      </ScreenMainScrollView>
    </ScreenMain>
  );
}
