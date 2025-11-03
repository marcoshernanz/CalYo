import { Doc } from "@/convex/_generated/dataModel";
import SafeArea from "../ui/SafeArea";
import MealItemHeader from "./MealItemHeader";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { StyleSheet, View } from "react-native";
import WithSkeleton from "../ui/WithSkeleton";
import Text from "../ui/Text";

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
              loading={isLoading}
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

          {/* <MealMacros loading={loading} totals={totals} /> */}
          {/* <MealIngredients loading={loading} items={items} /> */}
        </SafeArea>
      </Animated.ScrollView>

      {/* <MealFooter /> */}
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
  },
  nameContainer: {
    paddingBottom: 16,
  },
});
