import {
  StyleSheet,
  useWindowDimensions,
  View,
  Pressable,
  ViewStyle,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";
import getColor from "@/lib/ui/getColor";
import React, { useRef, useState } from "react";
import Button from "./Button";
import getShadow from "@/lib/ui/getShadow";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react-native";
import { useSafeArea } from "./SafeArea";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  showArrows?: boolean;
};

export default function Carousel({ children, style, showArrows }: Props) {
  const dimensions = useWindowDimensions();
  const scrollX = useSharedValue(0);
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const numChildren = React.Children.count(children);
  const insets = useSafeArea();
  const [activeIndex, setActiveIndex] = useState(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x / dimensions.width;
    },
  });

  const scrollToIndex = (index: number) => {
    const clampedIndex = Math.min(Math.max(index, 0), numChildren - 1);
    setActiveIndex(clampedIndex);
    scrollViewRef.current?.scrollTo({
      x: clampedIndex * dimensions.width,
      animated: true,
    });
  };

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const nextIndex = Math.round(
      event.nativeEvent.contentOffset.x / dimensions.width
    );
    setActiveIndex(Math.min(Math.max(nextIndex, 0), numChildren - 1));
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.viewport}>
        <Animated.ScrollView
          horizontal
          ref={scrollViewRef}
          onScroll={onScroll}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          style={[{ width: dimensions.width }, styles.scrollView]}
          contentContainerStyle={{ width: dimensions.width * numChildren }}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
        >
          {children}
        </Animated.ScrollView>
        {showArrows && numChildren > 1 ? (
          <View pointerEvents="box-none" style={StyleSheet.absoluteFillObject}>
            <Button
              variant="secondary"
              size="sm"
              style={[styles.arrowButton, { left: insets.left }]}
              hitSlop={10}
              disabled={activeIndex <= 0}
              accessibilityLabel="Previous"
              onPress={() => {
                scrollToIndex(activeIndex - 1);
              }}
            >
              <ChevronLeftIcon size={20} color={getColor("foreground")} />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              style={[styles.arrowButton, { right: insets.right }]}
              hitSlop={10}
              disabled={activeIndex >= numChildren - 1}
              accessibilityLabel="Next"
              onPress={() => {
                scrollToIndex(activeIndex + 1);
              }}
            >
              <ChevronRightIcon size={20} color={getColor("foreground")} />
            </Button>
          </View>
        ) : null}
      </View>
      <View style={styles.indicatorContainer}>
        {Array.from({ length: numChildren }).map((_, index) => (
          <CarouselDot
            key={index}
            index={index}
            scrollX={scrollX}
            onPress={() => {
              scrollToIndex(index);
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
  viewport: {
    position: "relative",
  },
  scrollView: {
    flexGrow: 0,
    overflow: "visible",
  },
  arrowButton: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: "-50%" }],
    aspectRatio: 1,
    ...getShadow("md"),
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
