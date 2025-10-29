import AnimateableText from "react-native-animateable-text";
import {
  PixelRatio,
  Platform,
  StyleSheet,
  useWindowDimensions,
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
import getColor from "@/lib/ui/getColor";
import { LinearGradient } from "expo-linear-gradient";

interface Props {
  minWeight: number;
  maxWeight: number;
  initialWeight: number;
  highlightedWeight?: number;
  highlightSide?: "left" | "right";
  formatWeight: (weight: number) => string;
  onChange?: (weight: number) => void;
}

export default function WeightPicker({
  minWeight,
  maxWeight,
  initialWeight,
  highlightedWeight,
  highlightSide,
  formatWeight,
  onChange,
}: Props) {
  const dimensions = useWindowDimensions();

  const height = 75;
  const bigLineHeight = 40;
  const smallLineHeight = 25;
  const width = PixelRatio.roundToNearestPixel(dimensions.width - 32);
  const numBigLinesVisible = 5;
  const startInt = Math.ceil(minWeight);
  const endInt = Math.floor(maxWeight);
  const numBigLines = Math.max(0, endInt - startInt + 1);
  const totalTenths = Math.max(0, Math.round((maxWeight - minWeight) * 10));
  const rawSpace = width / ((numBigLinesVisible - 1) * 10);
  const space = PixelRatio.roundToNearestPixel(rawSpace);
  const defaultOffset = PixelRatio.roundToNearestPixel(
    (initialWeight - minWeight) * space * 10
  );
  const center = PixelRatio.roundToNearestPixel(width / 2);
  const contentWidth = width + totalTenths * space;

  const panX = useSharedValue(center - defaultOffset);
  const transform = useDerivedValue(() => [{ translateX: panX.value }]);

  const weight = useDerivedValue(() => {
    const weight =
      -panX.value / space / 10 + minWeight + (numBigLinesVisible - 1) / 2;
    const roundedWeight = Math.round(weight * 10) / 10;
    return Math.min(Math.max(roundedWeight, minWeight), maxWeight);
  });

  const primaryLinesPath = Skia.Path.Make();
  for (let w = startInt; w <= endInt; w++) {
    const xPos = (w - minWeight) * 10 * space;
    primaryLinesPath.moveTo(xPos, height);
    primaryLinesPath.lineTo(xPos, height - bigLineHeight);
  }

  const secondaryLinesPath = Skia.Path.Make();
  for (let k = 1; k <= Math.max(0, totalTenths - 1); k++) {
    const w = minWeight + k / 10;
    const isInteger = Math.abs(w - Math.round(w)) < 1e-6;
    if (isInteger) {
      continue;
    }

    const xPos = k * space;
    secondaryLinesPath.moveTo(xPos, height);
    secondaryLinesPath.lineTo(xPos, height - smallLineHeight);
  }

  const highlightedLinePath = Skia.Path.Make();
  if (highlightedWeight) {
    const xPos = (highlightedWeight - minWeight) * space * 10;
    const lineHeight =
      highlightedWeight % 1 === 0 ? bigLineHeight : smallLineHeight;

    highlightedLinePath.moveTo(xPos, height);
    highlightedLinePath.lineTo(xPos, height - lineHeight);
  }

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
        snapToInterval={space}
        scrollEventThrottle={16}
      >
        <View style={{ width: contentWidth }} />
      </Animated.ScrollView>
      <View style={[styles.innerContainer, { width, height }]}>
        {highlightSide && (
          <View
            style={[
              styles.highlightSide,
              {
                height: smallLineHeight,
                width: width / 2,
              },
              highlightSide === "left" ? { left: 0 } : { right: 0 },
            ]}
          />
        )}
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
        <AnimateableText
          animatedProps={animatedProps.weightText}
          style={[styles.weightText, { bottom: height + 12 }]}
        />

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
            <Path
              path={highlightedLinePath}
              color={getColor("primary")}
              style="stroke"
              strokeWidth={2}
            />
            {Array.from({ length: numBigLines }, (_, i) => {
              const labelWidth = space * 10;
              const value = startInt + i;
              const label = String(value);

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
                  x={(value - minWeight) * 10 * space - labelWidth / 2}
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
  highlightSide: {
    position: "absolute",
    backgroundColor: getColor("primary", 0.5),
    bottom: 0,
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
