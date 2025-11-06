import {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import MealHeader from "./MealHeader";
import MealIngredients from "./MealIngredients";
import MealMacros from "./MealMacros";
import {
  ScreenHeader,
  ScreenHeaderActions,
  ScreenHeaderBackButton,
  ScreenHeaderTitle,
} from "../ui/screen/ScreenHeader";
import { SparklesIcon, TrashIcon } from "lucide-react-native";
import { useRouter } from "expo-router";
import useDeleteMeal from "@/lib/hooks/useDeleteMeal";
import { useRef } from "react";
import {
  ScreenFooter,
  ScreenFooterButton,
  ScreenFooterButtonIcon,
  ScreenFooterButtonText,
} from "../ui/screen/ScreenFooter";
import getColor from "@/lib/ui/getColor";
import {
  ScreenMain,
  ScreenMainScrollView,
  ScreenMainTitle,
} from "../ui/screen/ScreenMain";

type Props = {
  loading: boolean;
  name?: string;
  mealId?: React.ComponentProps<typeof MealHeader>["mealId"];
  totals?: React.ComponentProps<typeof MealMacros>["totals"];
  items?: React.ComponentProps<typeof MealIngredients>["items"];
};

export default function Meal({ loading, name, mealId, totals, items }: Props) {
  const router = useRouter();
  const deleteMeal = useDeleteMeal();
  const isDeletingRef = useRef(false);
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const handleDelete = () => {
    if (!mealId || isDeletingRef.current) return;
    isDeletingRef.current = true;
    router.replace("/app");
    void deleteMeal({ id: mealId });
  };

  return (
    <ScreenMain edges={[]}>
      <ScreenHeader>
        <ScreenHeaderBackButton />
        <ScreenHeaderTitle title="Comida" />
        <ScreenHeaderActions
          options={[
            {
              Icon: TrashIcon,
              text: "Eliminar",
              onPress: handleDelete,
              destructive: true,
            },
          ]}
        />
      </ScreenHeader>

      <ScreenMainScrollView
        scrollViewProps={{ onScroll }}
        safeAreaProps={{ edges: ["left", "right"] }}
      >
        <ScreenMainTitle title={name} loading={loading} />
        <MealMacros loading={loading} totals={totals} />
        <MealIngredients loading={loading} items={items} />
      </ScreenMainScrollView>

      <ScreenFooter>
        <ScreenFooterButton variant="outline">
          <ScreenFooterButtonIcon
            Icon={SparklesIcon}
            fill={getColor("foreground")}
          />
          <ScreenFooterButtonText text="Corregir" />
        </ScreenFooterButton>
        <ScreenFooterButton onPress={() => router.replace("/app")}>
          Hecho
        </ScreenFooterButton>
      </ScreenFooter>
    </ScreenMain>
  );
}
