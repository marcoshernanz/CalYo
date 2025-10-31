import { StyleSheet, View } from "react-native";
import Button from "../ui/Button";
import { useRouter } from "expo-router";
import {
  ArrowLeftIcon,
  EllipsisVerticalIcon,
  TrashIcon,
} from "lucide-react-native";
import Text from "../ui/Text";
import { Id } from "@/convex/_generated/dataModel";
import SafeArea from "../ui/SafeArea";
import getShadow from "@/lib/ui/getShadow";
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import Popover from "../ui/Popover";
import getColor from "@/lib/ui/getColor";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRef } from "react";

interface Props {
  mealId?: Id<"meals">;
  scrollY: SharedValue<number>;
}

export default function MealHeader({ mealId, scrollY }: Props) {
  const router = useRouter();
  const deleteMeal = useMutation(
    api.meals.deleteMeal.default
  ).withOptimisticUpdate((localStore, args) => {
    const { id } = args;

    const existingMeal = localStore.getQuery(api.meals.getMeal.default, {
      mealId: id,
    });
    if (existingMeal !== undefined) {
      localStore.setQuery(api.meals.getMeal.default, { mealId: id }, null);
    }

    const weekQueries = localStore.getAllQueries(
      api.meals.getWeekMeals.default
    );
    for (const { args: weekArgs, value } of weekQueries) {
      if (!value) continue;

      const updatedWeek = value.map((dayMeals) =>
        dayMeals.filter((meal) => meal._id !== id)
      );

      localStore.setQuery(
        api.meals.getWeekMeals.default,
        weekArgs,
        updatedWeek
      );
    }
  });
  const isDeletingRef = useRef(false);

  const shadowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 24], [0, 1], Extrapolation.CLAMP),
  }));

  const handleDelete = () => {
    if (!mealId || isDeletingRef.current) return;

    isDeletingRef.current = true;

    router.replace("/app");

    void deleteMeal({ id: mealId });
  };

  return (
    <SafeArea edges={["top", "left", "right"]} style={styles.container}>
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFillObject, styles.shadow, shadowStyle]}
      />
      <Button
        size="sm"
        variant="secondary"
        style={styles.button}
        onPress={() => router.back()}
      >
        <ArrowLeftIcon size={22} />
      </Button>
      <View style={styles.title}>
        <Text size="18" weight="600">
          Comida
        </Text>
      </View>
      <View style={{ position: "relative" }}>
        <Popover
          trigger={
            <Button size="sm" variant="secondary" style={styles.button}>
              <EllipsisVerticalIcon size={22} />
            </Button>
          }
          options={[
            {
              Item: (
                <View
                  style={{ alignItems: "center", flexDirection: "row", gap: 6 }}
                >
                  <TrashIcon
                    size={16}
                    strokeWidth={2.25}
                    color={getColor("red")}
                  />
                  <Text size="16" weight="500" color={getColor("red")}>
                    Eliminar
                  </Text>
                </View>
              ),
              onPress: handleDelete,
            },
          ]}
        />
      </View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    zIndex: 10,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  button: {
    aspectRatio: 1,
  },
  title: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  shadow: {
    ...getShadow("lg"),
  },
});
