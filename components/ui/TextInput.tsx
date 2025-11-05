import getColor from "@/lib/ui/getColor";
import React, { RefObject, useEffect, useRef, useState } from "react";
import {
  Keyboard,
  TextInput as RNTextInput,
  StyleSheet,
  TextInputProps,
  View,
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

const AnimatedTextInput = Animated.createAnimatedComponent(RNTextInput);
const AnimatedText = Animated.createAnimatedComponent(Text);

export interface TextInputHandle {
  focus: () => void;
  flashError: () => void;
}

interface Props extends TextInputProps {
  ref?: React.Ref<TextInputHandle>;
  label?: string;
}

export default function TextInput({
  label,
  style,
  onFocus,
  onBlur,
  ref,
  ...props
}: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const internalRef = useRef<RNTextInput>(null);

  const error = useSharedValue(0);
  const shake = useSharedValue(0);
  const isFocusedShared = useSharedValue(0);

  type FocusEventArg = Parameters<NonNullable<TextInputProps["onFocus"]>>[0];
  type BlurEventArg = Parameters<NonNullable<TextInputProps["onBlur"]>>[0];

  const handleFocus = (e: FocusEventArg) => {
    setIsFocused(true);
    isFocusedShared.value = withTiming(1, { duration: 200 });
    onFocus?.(e);
  };

  const handleBlur = (e: BlurEventArg) => {
    setIsFocused(false);
    isFocusedShared.value = withTiming(0, { duration: 200 });
    onBlur?.(e);
  };

  useEffect(() => {
    const subscription = Keyboard.addListener("keyboardDidHide", () => {
      internalRef.current?.blur();
    });
    return () => subscription.remove();
  }, []);

  const setInputRef = (instance: RNTextInput | null) => {
    internalRef.current = instance;

    if (ref) {
      const handle: TextInputHandle = {
        focus: () => {
          internalRef.current?.focus();
        },
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
      };

      if (typeof ref === "function") {
        ref(handle);
      } else {
        (ref as RefObject<TextInputHandle>).current = handle;
      }
    }
  };

  const baseColor = getColor("foreground");
  const errorColor = getColor("destructive");

  const animatedStyle = useAnimatedStyle(() => {
    "worklet";
    const borderColor = interpolateColor(
      error.value,
      [0, 1],
      [baseColor, errorColor]
    );

    return { borderColor, transform: [{ translateX: shake.value }] };
  }, [isFocused]);

  const animatedLabelStyle = useAnimatedStyle(() => {
    "worklet";
    const color = interpolateColor(
      isFocusedShared.value,
      [0, 1],
      [getColor("mutedForeground"), getColor("foreground")]
    );
    return { color };
  });

  const inputElement = (
    <AnimatedTextInput
      ref={setInputRef}
      style={[styles.textInput, style, animatedStyle]}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholderTextColor={getColor("mutedForeground")}
      keyboardAppearance="light"
      selectionColor={getColor("foreground")}
      {...props}
    />
  );

  if (label) {
    return (
      <View style={styles.container}>
        <AnimatedText size="14" style={[styles.label, animatedLabelStyle]}>
          {label}
        </AnimatedText>
        {inputElement}
      </View>
    );
  }

  return inputElement;
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  label: {
    fontWeight: 600,
  },
  textInput: {
    borderWidth: 2,
    color: getColor("foreground"),
    borderRadius: 10,
    padding: 12,
    backgroundColor: getColor("background"),
  },
});
