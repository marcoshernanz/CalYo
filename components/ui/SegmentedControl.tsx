import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import Button from "./Button";
import getColor from "@/lib/utils/getColor";
import { useEffect, useRef, useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface Props {
  options: string[];
  selectedOption: string;
  onChange: (option: string) => void;
}

export default function SegmentedControl({
  options,
  selectedOption,
  onChange,
}: Props) {
  const [optionsWidths, setOptionsWidths] = useState<number[]>(
    options.map(() => 0)
  );

  const indicatorInitializedRef = useRef(false);

  const selectedIndex = options.indexOf(selectedOption);

  const indicatorLeft = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);

  const indicatorStyle = useAnimatedStyle(() => ({
    width: indicatorWidth.value,
    left: indicatorLeft.value,
  }));

  const onOptionLayout = (event: LayoutChangeEvent, index: number) => {
    const { width } = event.nativeEvent.layout;
    setOptionsWidths((prev) => {
      const newLayouts = [...prev];
      newLayouts[index] = width;
      return newLayouts;
    });
  };

  const handleChange = (option: string) => {
    onChange(option);

    const index = options.indexOf(option);

    const width = optionsWidths[index] ?? 0;
    const left = optionsWidths
      .slice(0, Math.max(0, index))
      .reduce((acc, w) => acc + w, 0);

    const springConfig = { stiffness: 500, damping: 30, mass: 0.9 } as const;

    indicatorWidth.value = withSpring(width, springConfig);
    indicatorLeft.value = withSpring(left, springConfig);
  };

  useEffect(() => {
    if (selectedIndex < 0) return;
    if (indicatorInitializedRef.current) return;

    const allMeasured =
      optionsWidths.length === options.length &&
      optionsWidths.every((w) => w > 0);
    if (!allMeasured) return;

    indicatorInitializedRef.current = true;

    const width = optionsWidths[selectedIndex] ?? 0;
    const left = optionsWidths
      .slice(0, Math.max(0, selectedIndex))
      .reduce((acc, w) => acc + w, 0);

    indicatorWidth.value = width;
    indicatorLeft.value = left;
  }, [
    optionsWidths,
    selectedIndex,
    options.length,
    indicatorLeft,
    indicatorWidth,
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        <Animated.View
          pointerEvents="none"
          style={[
            {
              height: 40,
              position: "absolute",
              backgroundColor: getColor("foreground"),
              borderRadius: 999,
            },
            indicatorStyle,
          ]}
        />
        {options.map((option, index) => (
          <Button
            key={`option-${option}-${index}`}
            size="sm"
            variant="ghost"
            onLayout={(event) => onOptionLayout(event, index)}
            textProps={{
              style: {
                color:
                  selectedOption === option
                    ? getColor("background")
                    : getColor("foreground"),
              },
            }}
            onPress={() => handleChange(option)}
          >
            {option}
          </Button>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    height: 40,
    backgroundColor: getColor("secondary"),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
  },
});
