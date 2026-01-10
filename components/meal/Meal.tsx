import MealMacros from "./MealMacros";
import {
  ScreenHeader,
  ScreenHeaderActions,
  ScreenHeaderBackButton,
  ScreenHeaderTitle,
} from "../ui/screen/ScreenHeader";
import { SparklesIcon, TrashIcon } from "lucide-react-native";
import { useRouter } from "expo-router";
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
import useScrollY from "@/lib/hooks/reanimated/useScrollY";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRateLimit } from "@convex-dev/rate-limiter/react";
import { Toast } from "../ui/Toast";
import MealItems from "./MealItems";
import Carousel from "../ui/Carousel";
import SafeArea from "../ui/SafeArea";
import MealMicros from "./MealMicros";
import { MacrosType, MicrosType } from "@/convex/tables/mealItems";
import ProLabel from "../ProLabel";
import { useSubscriptionContext } from "@/context/SubscriptionContext";

type Props = {
  loading: boolean;
  name?: string;
  mealId?: Id<"meals">;
  totalMacros?: MacrosType;
  totalMicros?: MicrosType;
  mealItems?: React.ComponentProps<typeof MealItems>["items"];
};

export default function Meal({
  loading,
  name,
  mealId,
  totalMacros,
  totalMicros,
  mealItems,
}: Props) {
  const router = useRouter();
  const updateMeal = useMutation(api.meals.updateMeal.default);
  const isDeletingRef = useRef(false);
  const { isPro, navigateToPaywall } = useSubscriptionContext();

  const { scrollY, onScroll } = useScrollY();

  const { status } = useRateLimit(api.rateLimit.getAiFeaturesRateLimit, {
    getServerTimeMutation: api.rateLimit.getServerTime,
  });

  const handleDelete = () => {
    if (!mealId || isDeletingRef.current) return;
    isDeletingRef.current = true;
    void updateMeal({ id: mealId, meal: { status: "deleted" } });
  };

  const handleFixMeal = () => {
    if (!isPro) {
      navigateToPaywall();
      return;
    }

    if (status && !status.ok) {
      Toast.show({
        text: "Has alcanzado el límite diario de funciones de IA.",
        variant: "error",
      });
      return;
    }

    router.push({ pathname: "/app/(meal)/fix-meal", params: { mealId } });
  };

  return (
    <ScreenMain edges={[]}>
      <ScreenHeader scrollY={scrollY}>
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
        safeAreaProps={{ edges: [] }}
      >
        <SafeArea edges={["left", "right"]} style={{ flex: 0 }}>
          <ScreenMainTitle title={name} loading={loading} />
        </SafeArea>
        <Carousel showIndicators style={{ paddingBottom: 32 }}>
          <MealMacros macros={totalMacros} loading={loading} />
          <MealMicros
            source="meal"
            id={mealId}
            micros={totalMicros}
            loading={loading}
          />
        </Carousel>
        <SafeArea edges={["left", "right"]} style={{ flex: 0 }}>
          <MealItems loading={loading} items={mealItems} />
        </SafeArea>
      </ScreenMainScrollView>

      <ScreenFooter>
        <ScreenFooterButton
          variant="outline"
          onPress={handleFixMeal}
          disabled={loading || (status !== undefined && !status.ok)}
          style={{ position: "relative" }}
        >
          {!isPro && <ProLabel />}
          <ScreenFooterButtonIcon
            Icon={SparklesIcon}
            fill={getColor("foreground")}
          />
          <ScreenFooterButtonText text="Corregir" />
        </ScreenFooterButton>
        <ScreenFooterButton
          onPress={() => {
            router.dismissTo("/app");
          }}
        >
          Hecho
        </ScreenFooterButton>
      </ScreenFooter>
    </ScreenMain>
  );
}
