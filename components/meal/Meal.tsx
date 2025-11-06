import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import SafeArea from "../ui/SafeArea";
import MealHeader from "./MealHeader";
import MealIngredients from "./MealIngredients";
import MealMacros from "./MealMacros";
import Text from "../ui/Text";
import WithSkeleton from "../ui/WithSkeleton";
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
    <SafeArea edges={[]}>
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
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <SafeArea edges={["left", "right"]}>
          <View style={styles.nameContainer}>
            <WithSkeleton
              loading={loading}
              skeletonStyle={{
                height: 22,
                width: "75%",
                borderRadius: 8,
              }}
            >
              <Text weight="600" style={styles.name}>
                {name}
              </Text>
            </WithSkeleton>
          </View>

          <MealMacros loading={loading} totals={totals} />
          <MealIngredients loading={loading} items={items} />
        </SafeArea>
      </Animated.ScrollView>

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
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  name: {
    fontSize: 22,
  },
  nameContainer: {
    paddingBottom: 16,
  },
});
