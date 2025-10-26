import { useCallback } from "react";
import { LayoutChangeEvent, StyleSheet } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import SafeArea from "../ui/SafeArea";
import MealFooter from "./MealFooter";
import MealHeader from "./MealHeader";
import MealIngredients from "./MealIngredients";
import MealMacros from "./MealMacros";
import Text from "../ui/Text";

interface Props {
  name: string;
  mealId: React.ComponentProps<typeof MealHeader>["mealId"];
  totals: React.ComponentProps<typeof MealMacros>["totals"];
  items: React.ComponentProps<typeof MealIngredients>["items"];
}

export default function Meal({ name, mealId, totals, items }: Props) {
  const scrollY = useSharedValue(0);
  const contentHeight = useSharedValue(0);
  const layoutHeight = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      contentHeight.value = event.contentSize.height;
      layoutHeight.value = event.layoutMeasurement.height;
    },
  });

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      layoutHeight.value = event.nativeEvent.layout.height;
    },
    [layoutHeight]
  );

  const handleContentSizeChange = useCallback(
    (_: number, height: number) => {
      contentHeight.value = height;
    },
    [contentHeight]
  );

  return (
    <SafeArea edges={[]}>
      <MealHeader mealId={mealId} scrollY={scrollY} />
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onLayout={handleLayout}
        onContentSizeChange={handleContentSizeChange}
      >
        <SafeArea edges={["left", "right"]}>
          <Text weight="600" style={styles.name}>
            {name}
          </Text>
          <MealMacros totals={totals} />
          <MealIngredients items={items} />
        </SafeArea>
      </Animated.ScrollView>
      <MealFooter
        scrollY={scrollY}
        contentHeight={contentHeight}
        layoutHeight={layoutHeight}
      />
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 16,
  },
  name: {
    fontSize: 22,
    paddingBottom: 16,
  },
});
