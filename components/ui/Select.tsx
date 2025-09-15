import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import getColor from "@/lib/utils/getColor";
import { StyleSheet, View } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AnimatedText = Animated.createAnimatedComponent(Text);

type IconProp = React.ReactElement | React.ComponentType<any>;

interface OptionItemProps {
  label: string;
  Icon: IconProp;
  isSelected: boolean;
  onPress?: () => void;
}

function OptionItem({ label, Icon, isSelected, onPress }: OptionItemProps) {
  const progress = useSharedValue(isSelected ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isSelected ? 1 : 0, {
      duration: 220,
      easing: Easing.inOut(Easing.quad),
    });
  }, [isSelected, progress]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [getColor("secondary"), getColor("foreground")]
    );
    return { backgroundColor };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 1],
      [getColor("foreground"), getColor("background")]
    );
    return { color };
  });

  return (
    <Button
      style={[styles.optionButton, animatedContainerStyle]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <View style={styles.iconBackground}>
          {React.isValidElement(Icon)
            ? Icon
            : (() => {
                const Cmp = Icon as React.ComponentType<any>;
                return <Cmp color={getColor("foreground")} />;
              })()}
        </View>
      </View>
      <AnimatedText style={[styles.text, animatedTextStyle]}>
        {label}
      </AnimatedText>
    </Button>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    height: 80,
    width: "100%",
    borderRadius: 20,
  },
  iconContainer: {
    height: "100%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBackground: {
    backgroundColor: getColor("background"),
    height: 48,
    width: 48,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: 500,
  },
});

export type SelectOption = {
  name: string;
  label: string;
  Icon: IconProp;
};

interface Props {
  options: SelectOption[];
  selectedOptions?: string[];
  onSelectOption?: (optionName: string) => void;
}

export default function Select({
  options,
  selectedOptions,
  onSelectOption,
}: Props) {
  return (
    <View style={styles.container}>
      {options.map(({ name, label, Icon }, index) => (
        <OptionItem
          key={`option-${label}-${index}`}
          label={label}
          Icon={Icon}
          isSelected={!!selectedOptions?.includes(name)}
          onPress={() => onSelectOption?.(name)}
        />
      ))}
    </View>
  );
}
