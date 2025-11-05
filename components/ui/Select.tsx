import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import getColor from "@/lib/ui/getColor";
import { StyleSheet, View } from "react-native";
import React, { ComponentType, useEffect } from "react";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const AnimatedText = Animated.createAnimatedComponent(Text);

type IconComponentProps = {
  color?: string;
}

type IconProp = React.ReactElement | ComponentType<IconComponentProps>;

type OptionItemProps = {
  label: string;
  description?: string;
  Icon: IconProp;
  isSelected: boolean;
  onPress?: () => void;
  animated?: boolean;
  animationDelay?: number;
  index: number;
}

function OptionItem({
  label,
  description,
  Icon,
  isSelected,
  onPress,
  animated,
  animationDelay = 0,
  index,
}: OptionItemProps) {
  const progress = useSharedValue(isSelected ? 1 : 0);
  const appearance = useSharedValue(animated ? 0 : 1);

  useEffect(() => {
    progress.value = withTiming(isSelected ? 1 : 0, {
      duration: 220,
      easing: Easing.inOut(Easing.quad),
    });
  }, [isSelected, progress]);

  useEffect(() => {
    if (!animated) {
      appearance.value = 1;
      return;
    }

    const springConfig = { stiffness: 500, damping: 30, mass: 0.9 } as const;

    appearance.value = 0;
    appearance.value = withDelay(
      animationDelay + index * 120,
      withSpring(1, springConfig)
    );
  }, [animated, animationDelay, appearance, index]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [getColor("secondary"), getColor("foreground")]
    );
    return { backgroundColor };
  });

  const animatedLabelStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 1],
      [getColor("foreground"), getColor("background")]
    );
    return { color };
  });
  const animatedDescriptionStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 1],
      [getColor("foreground", 0.6), getColor("background", 0.75)]
    );
    return { color };
  });
  const animatedAppearanceStyle = useAnimatedStyle(() => {
    const scale = 0.85 + appearance.value * 0.15;
    return {
      transform: [{ scale }],
      opacity: appearance.value,
    };
  });

  return (
    <Animated.View style={[styles.optionWrapper, animatedAppearanceStyle]}>
      <Button
        style={[styles.optionButton, animatedContainerStyle]}
        onPress={onPress}
      >
        <View style={styles.iconContainer}>
          {React.isValidElement(Icon)
            ? Icon
            : React.createElement(Icon as ComponentType<IconComponentProps>, {
                color: getColor("foreground"),
              })}
        </View>

        <View style={styles.labelContainer}>
          <AnimatedText
            size="16"
            style={[
              { fontWeight: description ? 600 : 500 },
              animatedLabelStyle,
            ]}
          >
            {label}
          </AnimatedText>
          {description && (
            <AnimatedText size="14" style={animatedDescriptionStyle}>
              {description}
            </AnimatedText>
          )}
        </View>
      </Button>
    </Animated.View>
  );
}

export type SelectOption = {
  name: string;
  label: string;
  description?: string;
  Icon: IconProp;
}

type Props = {
  options: SelectOption[];
  selectedOptions?: string[];
  onSelectOption?: (optionName: string) => void;
  animated?: boolean;
  animationDelay?: number;
}

export default function Select({
  options,
  selectedOptions,
  onSelectOption,
  animated = false,
  animationDelay = 0,
}: Props) {
  return (
    <View style={styles.container}>
      {options.map(({ name, label, description, Icon }, index) => (
        <OptionItem
          key={`option-${label}-${index}`}
          label={label}
          description={description}
          Icon={Icon}
          isSelected={!!selectedOptions?.includes(name)}
          onPress={() => onSelectOption?.(name)}
          animated={animated}
          animationDelay={animationDelay}
          index={index}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  optionWrapper: {
    width: "100%",
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 80,
    height: "auto",
    width: "100%",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  iconContainer: {
    backgroundColor: getColor("background"),
    height: 48,
    width: 48,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  labelContainer: {
    flex: 1,
    gap: 2,
  },
});
