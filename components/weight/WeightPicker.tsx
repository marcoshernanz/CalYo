import AnimateableText from "react-native-animateable-text";
import {
  Dimensions,
  PixelRatio,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  useAnimatedProps,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import {
  Canvas,
  Group,
  Paragraph,
  Path,
  Skia,
  SkParagraphStyle,
  SkTextStyle,
  TextAlign,
  useFonts,
} from "@shopify/react-native-skia";
import { useMemo } from "react";
import getColor from "@/lib/utils/getColor";
import { LinearGradient } from "expo-linear-gradient";

interface Props {
  minWeight: number;
  maxWeight: number;
  initialWeight: number;
  formatWeight: (weight: number) => string;
  onChange?: (weight: number) => void;
}

export default function WeightPicker({
  minWeight,
  maxWeight,
  initialWeight,
  formatWeight,
  onChange,
}: Props) {
  const height = 75;
  const bigLineHeight = 40;
  const smallLineHeight = 25;
  const width = PixelRatio.roundToNearestPixel(
    Dimensions.get("window").width - 32
  );
  const numBigLinesVisible = 5;
  const numBigLines = maxWeight - minWeight + 1;
  const numSmallLines = (numBigLines - 1) * 9;
  // Quantize spacing to device pixel to avoid Android half-pixel drift
  const rawSpace = width / ((numBigLinesVisible - 1) * 10);
  const space = PixelRatio.roundToNearestPixel(rawSpace);
  const defaultOffset = PixelRatio.roundToNearestPixel(
    (initialWeight - minWeight) * space * 10
  );
  const center = PixelRatio.roundToNearestPixel(width / 2);
  // Ensure max contentOffset equals distance to last tick
  const contentWidth = width + (numBigLines - 1) * space * 10;

  const panX = useSharedValue(center - defaultOffset);
  const transform = useDerivedValue(() => [{ translateX: panX.value }]);

  const weight = useDerivedValue(() => {
    const weight =
      -panX.value / space / 10 + minWeight + (numBigLinesVisible - 1) / 2;
    const roundedWeight = Math.round(weight * 10) / 10;
    return Math.min(Math.max(roundedWeight, minWeight), maxWeight);
  });

  const primaryLinesPath = useMemo(() => {
    const path = Skia.Path.Make();

    let xPos = 0;

    for (let i = 0; i < numBigLines; i++) {
      path.moveTo(xPos, height);
      path.lineTo(xPos, height - bigLineHeight);
      xPos += space * 10;
    }

    return path;
  }, [numBigLines, space]);

  const secondaryLinesPath = useMemo(() => {
    const path = Skia.Path.Make();

    let xPos = space;

    for (let i = 1; i <= numSmallLines; i++) {
      path.moveTo(xPos, height);
      path.lineTo(xPos, height - smallLineHeight);
      xPos += space;
      if (i % 9 === 0) {
        xPos += space;
      }
    }

    return path;
  }, [numSmallLines, space]);

  const handleScroll = useAnimatedScrollHandler((event) => {
    panX.value = -event.contentOffset.x + center;
  });

  const handleScrollEnd = () => {
    onChange?.(weight.value);
  };

  const fontManager = useFonts({
    Inter: [
      require("@/node_modules/@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf"),
    ],
  });

  const animatedProps = {
    weightText: useAnimatedProps(() => ({
      text: String(formatWeight(weight.value)),
    })),
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScrollEnd}
        horizontal
        contentOffset={{ x: defaultOffset, y: 0 }}
        style={styles.scrollView}
        showsHorizontalScrollIndicator={false}
        overScrollMode="never"
        snapToInterval={space}
        scrollEventThrottle={16}
      >
        <View style={{ width: contentWidth }} />
      </Animated.ScrollView>
      <View style={[styles.innerContainer, { width, height }]}>
        <AnimateableText
          animatedProps={animatedProps.weightText}
          style={[styles.weightText, { bottom: height + 12 }]}
        />
        <LinearGradient
          colors={[getColor("background"), getColor("background", 0)]}
          style={[styles.leftGradient, { width: width / 8, height: height }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          pointerEvents="none"
        />
        <LinearGradient
          colors={[getColor("background"), getColor("background", 0)]}
          style={[styles.rightGradient, { width: width / 8, height: height }]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          pointerEvents="none"
        />
        <View style={[styles.indicator, { height }]} />

        <Canvas style={[styles.canvas, { height }]}>
          <Group transform={transform}>
            <Path
              path={primaryLinesPath}
              color={getColor("mutedForeground")}
              style="stroke"
              strokeWidth={1}
            />
            <Path
              path={secondaryLinesPath}
              color={getColor("mutedForeground", 0.5)}
              style="stroke"
              strokeWidth={1}
            />
            {Array.from({ length: numBigLines }, (_, i) => {
              const labelWidth = space * 10;
              const label = String(minWeight + i);

              const paragraph = (() => {
                if (!fontManager) return null;

                const paragraphStyle: SkParagraphStyle = {
                  textAlign: TextAlign.Center,
                };

                const textStyle: SkTextStyle = {
                  color: Skia.Color(getColor("mutedForeground")),
                  fontFamilies: ["Inter"],
                  fontSize: 12,
                };

                const paragraph = Skia.ParagraphBuilder.Make(
                  paragraphStyle,
                  fontManager
                )
                  .pushStyle(textStyle)
                  .addText(label)
                  .build();

                paragraph.layout(labelWidth);

                return paragraph;
              })();

              const paragraphHeight = paragraph?.getHeight() || 0;

              return (
                <Paragraph
                  key={`label-${i}-${label}`}
                  paragraph={paragraph}
                  x={i * space * 10 - labelWidth / 2}
                  y={height - bigLineHeight - 12 - paragraphHeight / 2}
                  width={labelWidth}
                />
              );
            })}
          </Group>
        </Canvas>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    height: "100%",
    position: "absolute",
    zIndex: 1,
  },
  innerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  indicator: {
    backgroundColor: getColor("primary"),
    width: 2,
    position: "absolute",
    zIndex: 2,
  },
  weightText: {
    fontSize: 20,
    position: "absolute",
    fontWeight: 700,
    fontFamily: "Inter_700Bold",
    color: getColor("foreground"),
    ...(Platform.OS === "android" ? { includeFontPadding: false } : null),
  },
  leftGradient: {
    position: "absolute",
    left: 0,
    zIndex: 1,
  },
  rightGradient: {
    position: "absolute",
    right: 0,
    zIndex: 1,
  },
  canvas: {
    width: "100%",
  },
});
