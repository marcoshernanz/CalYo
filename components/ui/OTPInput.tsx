import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { useRef, useState, useEffect } from "react";
import Text from "./Text";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withDelay,
  interpolateColor,
} from "react-native-reanimated";
import getColor from "@/lib/ui/getColor";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface OTPInputHandle {
  focus: () => void;
  flashError: () => void;
}

interface Props extends TextInputProps {
  ref?: React.Ref<OTPInputHandle>;
  length?: number;
  onFilled?: (code: string) => void;
}

export default function OTPInput({
  length = 4,
  onFilled,
  ref,
  ...props
}: Props) {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(props.autoFocus);

  const inputRef = useRef<TextInput>(null);

  const isFocusedShared = useSharedValue(0);

  const focusedInputIndex = text.length;

  const showCaret = Boolean(isFocused) && text.length !== length;

  const caretOpacity = useSharedValue(0);

  const error = useSharedValue(0);
  const shake = useSharedValue(0);

  const baseColor = getColor("mutedForeground");
  const errorColor = getColor("destructive");

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));

  const animatedBoxStyle = useAnimatedStyle(() => {
    "worklet";
    const color = interpolateColor(
      error.value,
      [0, 1],
      [baseColor, errorColor]
    );
    return { borderColor: color };
  });

  const animatedCaretStyle = useAnimatedStyle(() => {
    "worklet";
    return { opacity: caretOpacity.value };
  });

  useEffect(() => {
    if (showCaret) {
      caretOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 100 }),
          withDelay(400, withTiming(1, { duration: 0 })),
          withTiming(0, { duration: 100 }),
          withDelay(400, withTiming(0, { duration: 0 }))
        ),
        -1,
        true
      );
    } else {
      caretOpacity.value = 0;
    }
  }, [caretOpacity, showCaret]);

  useEffect(() => {
    if (ref) {
      const handle: OTPInputHandle = {
        focus: () => {
          inputRef.current?.focus();
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
        (ref as React.RefObject<OTPInputHandle>).current = handle;
      }
    }
  }, [ref, error, shake]);

  const handleTextChange = (value: string) => {
    if (/[^\d]/.test(value)) return;
    setText(value);
    props.onChangeText?.(value);
    if (value.length === length) {
      onFilled?.(value);
      inputRef.current?.blur();
    }
  };

  type FocusEventArg = Parameters<NonNullable<TextInputProps["onFocus"]>>[0];
  type BlurEventArg = Parameters<NonNullable<TextInputProps["onBlur"]>>[0];

  const handleFocus = (e: FocusEventArg) => {
    setIsFocused(true);
    isFocusedShared.value = withTiming(1, { duration: 200 });
    props.onFocus?.(e);
  };

  const handleBlur = (e: BlurEventArg) => {
    setIsFocused(false);
    isFocusedShared.value = withTiming(0, { duration: 200 });
    props.onBlur?.(e);
  };

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      {Array(length)
        .fill(0)
        .map((_, index) => {
          const char = text[index] || "";
          const isFocusedInput =
            Boolean(isFocused) &&
            (index === focusedInputIndex ||
              (index === length - 1 && text.length === length));

          return (
            <AnimatedPressable
              key={index}
              onPress={() => inputRef.current?.focus()}
              style={[
                styles.box,
                isFocusedInput && styles.focusedBox,
                animatedBoxStyle,
              ]}
            >
              <Text size="28" weight="700">
                {char}
              </Text>
              {showCaret && index === focusedInputIndex && (
                <View style={styles.caretContainer}>
                  <Animated.View style={[styles.caret, animatedCaretStyle]} />
                </View>
              )}
            </AnimatedPressable>
          );
        })}
      <TextInput
        value={text}
        onChangeText={handleTextChange}
        maxLength={length}
        inputMode="numeric"
        textContentType="oneTimeCode"
        ref={inputRef}
        autoComplete={"one-time-code"}
        onFocus={handleFocus}
        onBlur={handleBlur}
        caretHidden
        {...props}
        style={[styles.input, props.style]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 16,
    height: 100,
  },
  box: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  focusedBox: {
    borderColor: getColor("foreground"),
    borderWidth: 2,
  },
  caretContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  caret: {
    width: 2,
    height: 32,
    backgroundColor: getColor("foreground"),
  },
  input: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
  },
});
