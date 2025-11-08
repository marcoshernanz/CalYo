import getColor from "@/lib/ui/getColor";
import React, { useImperativeHandle, useRef } from "react";
import {
  FocusEvent,
  BlurEvent,
  TextInput as RNTextInput,
  StyleSheet,
  Platform,
  View,
  TextInputProps,
} from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Text from "./Text";
import Card from "./Card";
import Button from "./Button";

const AnimatedCard = Animated.createAnimatedComponent(Card);
const AnimatedText = Animated.createAnimatedComponent(Text);

export type TextInputHandle = {
  flashError: () => void;
};

type Props = {
  ref?: React.Ref<TextInputHandle>;
  label: string;
} & TextInputProps;

export default function TextInput({ ref, label, ...props }: Props) {
  const textInputRef = useRef<RNTextInput>(null);
  const focused = useSharedValue(0);
  const shake = useSharedValue(0);
  const error = useSharedValue(0);

  const handleFocus = (e: FocusEvent) => {
    focused.value = withTiming(1, { duration: 200 });
    props.onFocus?.(e);
  };

  const handleBlur = (e: BlurEvent) => {
    focused.value = withTiming(0, { duration: 200 });
    props.onBlur?.(e);
  };

  useImperativeHandle(
    ref,
    () => ({
      flashError: () => {
        error.value = withSequence(
          withTiming(1, { duration: 200 }),
          withDelay(100, withTiming(0, { duration: 200 }))
        );

        shake.value = withSequence(
          withTiming(8, { duration: 50 }),
          withTiming(-8, { duration: 50 }),
          withTiming(8, { duration: 50 }),
          withTiming(-8, { duration: 50 }),
          withTiming(8, { duration: 50 }),
          withTiming(0, { duration: 50 })
        );
      },
    }),
    [error, shake]
  );

  const animatedStyles = {
    label: useAnimatedStyle(() => {
      const initialColor = interpolateColor(
        focused.value,
        [0, 1],
        [getColor("mutedForeground", 0.6), getColor("mutedForeground")]
      );
      const color = interpolateColor(
        error.value,
        [0, 1],
        [initialColor, getColor("red")]
      );

      return { color };
    }),
    card: useAnimatedStyle(() => {
      const initialBorderColor = interpolateColor(
        focused.value,
        [0, 1],
        [getColor("secondary"), getColor("foreground")]
      );
      const borderColor = interpolateColor(
        error.value,
        [0, 1],
        [initialBorderColor, getColor("red")]
      );

      return { borderColor, transform: [{ translateX: shake.value }] };
    }),
  };

  return (
    <Button
      variant="base"
      size="base"
      style={styles.button}
      onPress={() => textInputRef.current?.focus()}
    >
      <AnimatedCard style={[styles.card, animatedStyles.card]}>
        <AnimatedText size="12" weight="500" style={animatedStyles.label}>
          {label}
        </AnimatedText>
        <View pointerEvents="none">
          <RNTextInput
            ref={textInputRef}
            style={styles.textInput}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholderTextColor={getColor("mutedForeground")}
            cursorColor={getColor("foreground")}
            selectionColor={Platform.select({
              ios: getColor("foreground"),
              android: getColor("foreground", 0.2),
            })}
            selectionHandleColor={getColor("foreground")}
            {...props}
          />
        </View>
      </AnimatedCard>
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
  },
  card: {
    padding: 12,
    paddingHorizontal: 16,
    gap: 4,
  },
  textInput: {
    color: getColor("foreground"),
    padding: 0,
    includeFontPadding: false,
    fontSize: 16,
  },
});
