import { Dimensions, PixelRatio, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { Canvas, Group, Path, Skia } from "@shopify/react-native-skia";
import { useMemo } from "react";
import getColor from "@/lib/utils/getColor";

interface Props {
  minWeight: number;
  maxWeight: number;
  defaultWeight: number;
}

export default function WeightPicker({
  minWeight,
  maxWeight,
  defaultWeight,
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
  const space = PixelRatio.roundToNearestPixel(
    width / (numBigLinesVisible - 1) / 10
  );
  const defaultOffset = PixelRatio.roundToNearestPixel(
    (defaultWeight - minWeight) * space * 10
  );
  const center = PixelRatio.roundToNearestPixel(width / 2);
  const contentWidth = PixelRatio.roundToNearestPixel(
    (numBigLines + 3) * space * 10
  );

  const panX = useSharedValue(center - defaultOffset);
  const transform = useDerivedValue(() => [{ translateX: panX.value }]);

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

  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: getColor("primary"),
          width: 2,
          height,
          position: "absolute",
          zIndex: 2,
        }}
      />

      <Animated.ScrollView
        onScroll={handleScroll}
        horizontal
        contentOffset={{ x: defaultOffset, y: 0 }}
        style={{
          height: "100%",
          position: "absolute",
          zIndex: 1,
        }}
        showsHorizontalScrollIndicator={false}
        overScrollMode="never"
        snapToInterval={space}
        scrollEventThrottle={16}
      >
        <View style={{ width: contentWidth }} />
      </Animated.ScrollView>
      <Canvas style={{ height, width: "100%" }}>
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
        </Group>
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
