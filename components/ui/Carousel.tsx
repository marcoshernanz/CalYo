import {
  StyleSheet,
  useWindowDimensions,
  View,
  Pressable,
  ViewStyle,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
} from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";
import getColor from "@/lib/ui/getColor";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Button from "./Button";
import getShadow from "@/lib/ui/getShadow";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react-native";
import { useSafeArea } from "./SafeArea";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  showArrows?: boolean;
  showIndicators?: boolean;
  infinite?: boolean;
};

export default function Carousel({
  children,
  style,
  showArrows = false,
  showIndicators = false,
  infinite = false,
}: Props) {
  const dimensions = useWindowDimensions();
  const scrollX = useSharedValue(0);
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const childrenArray = useMemo(
    () => React.Children.toArray(children),
    [children]
  );
  const numChildren = childrenArray.length;
  const isInfinite = infinite && numChildren > 1;
  const pages = useMemo(() => {
    if (!isInfinite) return childrenArray;

    const first = childrenArray[0];
    const last = childrenArray[numChildren - 1];
    return [last, ...childrenArray, first];
  }, [childrenArray, isInfinite, numChildren]);
  const pageCount = pages.length;
  const insets = useSafeArea();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(activeIndex);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x / dimensions.width;
    },
  });

  const clampIndex = useCallback(
    (index: number) => Math.min(Math.max(index, 0), numChildren - 1),
    [numChildren]
  );

  const scrollToPageIndex = useCallback(
    (pageIndex: number, animated: boolean) => {
      scrollViewRef.current?.scrollTo({
        x: pageIndex * dimensions.width,
        animated,
      });
    },
    [dimensions.width]
  );

  const scrollToIndex = (index: number) => {
    if (numChildren <= 0) return;

    const clampedIndex = clampIndex(index);
    setActiveIndex(clampedIndex);

    const pageIndex = isInfinite ? clampedIndex + 1 : clampedIndex;
    scrollToPageIndex(pageIndex, true);
  };

  const scrollToPrev = () => {
    if (numChildren <= 1) return;

    if (!isInfinite) {
      scrollToIndex(activeIndex - 1);
      return;
    }

    if (activeIndex <= 0) {
      setActiveIndex(numChildren - 1);
      scrollToPageIndex(0, true);
      return;
    }

    scrollToIndex(activeIndex - 1);
  };

  const scrollToNext = () => {
    if (numChildren <= 1) return;

    if (!isInfinite) {
      scrollToIndex(activeIndex + 1);
      return;
    }

    if (activeIndex >= numChildren - 1) {
      setActiveIndex(0);
      scrollToPageIndex(numChildren + 1, true);
      return;
    }

    scrollToIndex(activeIndex + 1);
  };

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const pageIndex = Math.round(
      event.nativeEvent.contentOffset.x / dimensions.width
    );

    if (!isInfinite) {
      setActiveIndex(clampIndex(pageIndex));
      return;
    }

    if (pageIndex === 0) {
      setActiveIndex(numChildren - 1);
      scrollToPageIndex(numChildren, false);
      return;
    }

    if (pageIndex === numChildren + 1) {
      setActiveIndex(0);
      scrollToPageIndex(1, false);
      return;
    }

    setActiveIndex(clampIndex(pageIndex - 1));
  };

  useEffect(() => {
    if (numChildren <= 0) return;

    const currentIndex = clampIndex(activeIndexRef.current);
    const targetPageIndex = isInfinite ? currentIndex + 1 : currentIndex;
    scrollToPageIndex(targetPageIndex, false);
  }, [
    clampIndex,
    dimensions.width,
    isInfinite,
    numChildren,
    scrollToPageIndex,
  ]);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.viewport}>
        <Animated.ScrollView
          horizontal
          ref={scrollViewRef}
          onScroll={onScroll}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          style={[{ width: dimensions.width }, styles.scrollView]}
          contentOffset={
            isInfinite ? { x: dimensions.width, y: 0 } : { x: 0, y: 0 }
          }
          contentContainerStyle={{ width: dimensions.width * pageCount }}
          showsHorizontalScrollIndicator={false}
          overScrollMode={Platform.OS === "android" ? "never" : "auto"}
          pagingEnabled
        >
          {pages.map((child, pageIndex) => (
            <React.Fragment key={`carousel-page-${pageIndex}`}>
              {child}
            </React.Fragment>
          ))}
        </Animated.ScrollView>
        {showArrows && numChildren > 1 && (
          <View pointerEvents="box-none" style={StyleSheet.absoluteFillObject}>
            <View
              pointerEvents="box-none"
              style={[styles.arrowContainer, { left: insets.left }]}
            >
              <Button
                variant="secondary"
                size="sm"
                style={styles.arrowButton}
                hitSlop={10}
                disabled={!isInfinite && activeIndex <= 0}
                accessibilityLabel="Previous"
                onPress={() => {
                  scrollToPrev();
                }}
              >
                <ChevronLeftIcon size={20} color={getColor("foreground")} />
              </Button>
            </View>
            <View
              pointerEvents="box-none"
              style={[styles.arrowContainer, { right: insets.right }]}
            >
              <Button
                variant="secondary"
                size="sm"
                style={styles.arrowButton}
                hitSlop={10}
                disabled={!isInfinite && activeIndex >= numChildren - 1}
                accessibilityLabel="Next"
                onPress={() => {
                  scrollToNext();
                }}
              >
                <ChevronRightIcon size={20} color={getColor("foreground")} />
              </Button>
            </View>
          </View>
        )}
      </View>
      {showIndicators && numChildren > 1 && (
        <View style={styles.indicatorContainer}>
          {Array.from({ length: numChildren }).map((_, index) => (
            <CarouselDot
              key={index}
              index={index}
              scrollX={scrollX}
              activeIndex={activeIndex}
              useActiveIndex={isInfinite}
              onPress={() => {
                scrollToIndex(index);
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
}

type DotProps = {
  index: number;
  scrollX: SharedValue<number>;
  activeIndex?: number;
  useActiveIndex?: boolean;
  onPress: () => void;
};

function CarouselDot({
  index,
  scrollX,
  activeIndex,
  useActiveIndex,
  onPress,
}: DotProps) {
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

  if (useActiveIndex) {
    return (
      <Pressable
        style={[
          styles.indicatorDot,
          {
            backgroundColor:
              activeIndex === index ? activeColor : inactiveColor,
          },
        ]}
        hitSlop={3}
        onPress={onPress}
      />
    );
  }

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
  arrowContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  arrowButton: {
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
