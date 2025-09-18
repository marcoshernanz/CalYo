import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import Button from "./Button";
import getColor from "@/lib/utils/getColor";
import Text from "./Text";
import { useEffect, useRef, useState } from "react";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";

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

  const indicatorLeft = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);

  const selectedIndex = options.indexOf(selectedOption);
  const selectedIndexSV = useSharedValue(selectedIndex);

  useEffect(() => {
    if (selectedIndex < 0) return;
    selectedIndexSV.value = selectedIndex;

    const allMeasured =
      optionsWidths.length === options.length &&
      optionsWidths.every((w) => w > 0);
    if (!allMeasured) return;

    const width = optionsWidths[selectedIndex];
    const left = optionsWidths
      .slice(0, Math.max(0, selectedIndex))
      .reduce((acc, w) => acc + w, 0);

    const springConfig = { stiffness: 500, damping: 30, mass: 0.9 } as const;
    if (!indicatorInitializedRef.current) {
      indicatorInitializedRef.current = true;
      indicatorWidth.value = width;
      indicatorLeft.value = left;
    } else {
      indicatorWidth.value = withSpring(width, springConfig);
      indicatorLeft.value = withSpring(left, springConfig);
    }
  }, [
    selectedIndex,
    optionsWidths,
    indicatorLeft,
    indicatorWidth,
    options.length,
    selectedIndexSV,
  ]);

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

  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        <Animated.View
          pointerEvents="none"
          style={[styles.indicator, indicatorStyle]}
        />
        {options.map((option, index) => (
          <Button
            key={`option-${option}-${index}`}
            size="sm"
            variant="ghost"
            onLayout={(event) => onOptionLayout(event, index)}
            onPress={() => onChange(option)}
          >
            <OptionLabel
              label={option}
              index={index}
              selectedIndexSV={selectedIndexSV}
            />
          </Button>
        ))}
      </View>
    </View>
  );
}

const AnimatedText = Animated.createAnimatedComponent(Text);

interface OptionLabelProps {
  label: string;
  index: number;
  selectedIndexSV: SharedValue<number>;
}

function OptionLabel({ label, index, selectedIndexSV }: OptionLabelProps) {
  const progress = useDerivedValue(() =>
    withTiming(selectedIndexSV.value === index ? 1 : 0, { duration: 180 })
  );

  const animatedTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 1],
      [getColor("foreground"), getColor("background")]
    );
    return { color };
  });

  return (
    <AnimatedText size="14" style={[styles.optionText, animatedTextStyle]}>
      {label}
    </AnimatedText>
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
  indicator: {
    height: 40,
    position: "absolute",
    backgroundColor: getColor("foreground"),
    borderRadius: 999,
  },
  optionText: {
    fontWeight: 600,
  },
});
