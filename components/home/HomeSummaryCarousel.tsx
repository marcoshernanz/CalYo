import { StyleSheet, useWindowDimensions, View, Pressable } from "react-native";
import HomeMacroSummary from "./HomeMacroSummary";
import Animated, {
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import getColor from "@/lib/ui/getColor";
import { useRef } from "react";
import HomeMicroSummary from "./HomeMicroSummary";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
};

export default function HomeSummaryCarousel({ totals }: Props) {
  const dimensions = useWindowDimensions();
  const scrollX = useSharedValue(0);
  const scrollViewRef = useRef<Animated.ScrollView>(null);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x / dimensions.width;
    },
  });

  const animatedStyles = {
    indicatorDot1: useAnimatedStyle(() => ({
      backgroundColor: interpolateColor(
        scrollX.value,
        [0, 1],
        [getColor("mutedForeground"), getColor("secondary")]
      ),
    })),
    indicatorDot2: useAnimatedStyle(() => ({
      backgroundColor: interpolateColor(
        scrollX.value,
        [0, 1],
        [getColor("secondary"), getColor("mutedForeground")]
      ),
    })),
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        horizontal
        ref={scrollViewRef}
        onScroll={onScroll}
        style={[{ width: dimensions.width }, styles.scrollView]}
        contentContainerStyle={{ width: dimensions.width * 2 }}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
      >
        <HomeMacroSummary totals={totals} />
        <HomeMicroSummary
          totals={{
            score: 67,
            fiber: 15,
            sugar: 40,
            sodium: 1500,
          }}
        />
      </Animated.ScrollView>
      <View style={styles.indicatorContainer}>
        <AnimatedPressable
          style={[styles.indicatorDot, animatedStyles.indicatorDot1]}
          hitSlop={3}
          onPress={() => {
            scrollViewRef.current?.scrollTo({ x: 0, animated: true });
          }}
        ></AnimatedPressable>
        <AnimatedPressable
          style={[styles.indicatorDot, animatedStyles.indicatorDot2]}
          hitSlop={3}
          onPress={() => {
            scrollViewRef.current?.scrollTo({
              x: dimensions.width,
              animated: true,
            });
          }}
        ></AnimatedPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  scrollView: {
    flexGrow: 0,
    overflow: "visible",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
});
