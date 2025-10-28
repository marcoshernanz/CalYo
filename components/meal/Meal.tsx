import { StyleSheet, View } from "react-native";
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
import Skeleton from "../ui/Skeleton";

interface Props {
  loading: boolean;
  name?: string;
  mealId?: React.ComponentProps<typeof MealHeader>["mealId"];
  totals?: React.ComponentProps<typeof MealMacros>["totals"];
  items?: React.ComponentProps<typeof MealIngredients>["items"];
}

export default function Meal({ loading, name, mealId, totals, items }: Props) {
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // TODO: Disable interactions while loading? (like going back)
  // TODO: Show labels that are known ahead of time? (calories, carbs, protein, fat)
  // TODO: Make text and elements invisible and render the skeletons instead of shifting them?

  return (
    <SafeArea edges={[]}>
      <MealHeader mealId={mealId} scrollY={scrollY} />
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <SafeArea edges={["left", "right"]}>
          <View style={styles.nameContainer}>
            {loading ? (
              <Skeleton style={styles.nameSkeleton} />
            ) : (
              <Text weight="600" style={styles.name}>
                {name}
              </Text>
            )}
          </View>
          <MealMacros loading={loading} totals={totals} />
          <MealIngredients loading={loading} items={items} />
        </SafeArea>
      </Animated.ScrollView>
      <MealFooter />
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
  nameSkeleton: {
    height: 22,
    width: "100%",
    borderRadius: 8,
  },
});
