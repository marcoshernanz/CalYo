import { Doc } from "@/convex/_generated/dataModel";
import SafeArea from "../ui/SafeArea";
import MealItemHeader from "./MealItemHeader";
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

interface Props {
  name?: string;
  mealItem?: Doc<"mealItems">;
  isLoading: boolean;
}

export default function MealItem({ name, mealItem, isLoading }: Props) {
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <SafeArea edges={[]}>
      <MealItemHeader scrollY={scrollY} />
      {/* <Animated.ScrollView
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

      <MealFooter /> */}
    </SafeArea>
  );
}
