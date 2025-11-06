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
import { useRef } from "react";
import useDeleteMeal from "@/lib/hooks/useDeleteMeal";

type Props = {
  mealId?: Id<"meals">;
  scrollY: SharedValue<number>;
};

export default function MealHeader({ mealId, scrollY }: Props) {
  const router = useRouter();
  const deleteMeal = useDeleteMeal();
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
    <SafeArea edges={["top", "left", "right"]} style={styles.safeArea}>
      {/* <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFillObject, styles.shadow, shadowStyle]}
      /> */}
      <View style={styles.container}>
        <View style={{ position: "relative" }}>
          <Popover
            trigger={
              <Button size="sm" variant="secondary" style={styles.button}>
                <EllipsisVerticalIcon size={22} />
              </Button>
            }
            options={[
              {
                Icon: TrashIcon,
                text: "Eliminar",
                onPress: handleDelete,
                destructive: true,
              },
            ]}
          />
        </View>
      </View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 0,
    zIndex: 10,
    paddingBottom: 16,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
  },
  button: {
    aspectRatio: 1,
  },
  title: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  shadow: {
    ...getShadow("lg"),
  },
});
