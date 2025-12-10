import { StyleSheet, useWindowDimensions, View, Pressable } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";
import getColor from "@/lib/ui/getColor";
import React, { useRef } from "react";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  children: React.ReactNode;
};

export default function Carousel({ children }: Props) {
  const dimensions = useWindowDimensions();
  const scrollX = useSharedValue(0);
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const numChildren = React.Children.count(children);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x / dimensions.width;
    },
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        horizontal
        ref={scrollViewRef}
        onScroll={onScroll}
        style={[{ width: dimensions.width }, styles.scrollView]}
        contentContainerStyle={{ width: dimensions.width * numChildren }}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
      >
        {children}
      </Animated.ScrollView>
      <View style={styles.indicatorContainer}>
        {Array.from({ length: numChildren }).map((_, index) => (
          <CarouselDot
            key={index}
            index={index}
            scrollX={scrollX}
            onPress={() => {
              scrollViewRef.current?.scrollTo({
                x: index * dimensions.width,
                animated: true,
              });
            }}
          />
        ))}
      </View>
    </View>
  );
}

type DotProps = {
  index: number;
  scrollX: SharedValue<number>;
  onPress: () => void;
};

function CarouselDot({ index, scrollX, onPress }: DotProps) {
  const activeColor = getColor("mutedForeground");
  const inactiveColor = getColor("secondary");

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        scrollX.value,
        [index - 1, index, index + 1],
        [inactiveColor, activeColor, inactiveColor]
      ),
    };
  });

  return (
    <AnimatedPressable
      style={[styles.indicatorDot, animatedStyle]}
      hitSlop={3}
      onPress={onPress}
    />
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
