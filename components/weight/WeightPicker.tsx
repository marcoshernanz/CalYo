import { Dimensions, StyleSheet, View } from "react-native";
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
  const height = 80;
  const bigLineHeight = 50;
  const smallLineHeight = 40;
  const width = Dimensions.get("window").width - 32;
  const numBigLinesVisible = 5;
  const space = width / (numBigLinesVisible - 1) / 10;

  const panX = useSharedValue(0);
  const transform = useDerivedValue(() => [{ translateX: panX.value }]);

  const linesPath = useMemo(() => {
    const path = Skia.Path.Make();

    const numBigLines = maxWeight - minWeight + 1;

    let xPos = 0;

    for (let i = 0; i < numBigLines; i++) {
      path.moveTo(xPos, height);
      path.lineTo(xPos, height - bigLineHeight);
      xPos += space;

      if (i === numBigLines - 1) continue;

      for (let j = 1; j < 10; j++) {
        path.moveTo(xPos, height);
        path.lineTo(xPos, height - smallLineHeight);
        xPos += space;
      }
    }

    return path;
  }, [maxWeight, minWeight, space]);

  const handleScroll = useAnimatedScrollHandler((event) => {
    panX.value = -event.contentOffset.x + width / 2;
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
        style={{
          height: "100%",
          position: "absolute",
          zIndex: 1,
        }}
        showsHorizontalScrollIndicator={false}
        overScrollMode="never"
        snapToInterval={space}
      >
        <View style={{ width: 2000 }} />
      </Animated.ScrollView>
      <Canvas style={{ height, width: "100%" }}>
        <Group transform={transform}>
          <Path
            path={linesPath}
            color={getColor("foreground")}
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
