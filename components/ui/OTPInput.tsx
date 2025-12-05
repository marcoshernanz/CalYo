import {
  Keyboard,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { useRef, useState, useEffect, useImperativeHandle } from "react";
import Text from "./Text";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withDelay,
  interpolateColor,
  SharedValue,
} from "react-native-reanimated";
import getColor from "@/lib/ui/getColor";
import Button from "./Button";
import Card from "./Card";

const AnimatedCard = Animated.createAnimatedComponent(Card);

type OTPInputBoxProps = {
  char: string;
  showCaret: boolean;
  isFocused: boolean;
  error: SharedValue<number>;
  shake: SharedValue<number>;
  caretOpacity: SharedValue<number>;
  onPress: () => void;
};

function OTPInputBox({
  char,
  showCaret,
  isFocused,
  error,
  shake,
  caretOpacity,
  onPress,
}: OTPInputBoxProps) {
  const animatedStyles = {
    card: useAnimatedStyle(() => {
      const initialBorderColor = isFocused
        ? getColor("foreground")
        : getColor("secondary");
      const borderColor = interpolateColor(
        error.value,
        [0, 1],
        [initialBorderColor, getColor("red")]
      );

      return { borderColor, transform: [{ translateX: shake.value }] };
    }),
    caret: useAnimatedStyle(() => {
      return { opacity: caretOpacity.value };
    }),
  };

  return (
    <Button variant="base" size="base" onPress={onPress} style={{ flex: 1 }}>
      <AnimatedCard style={[styles.card, animatedStyles.card]}>
        <Text size="32" weight="600">
          {char}
        </Text>
        {showCaret && (
          <View style={styles.caretContainer}>
            <Animated.View style={[styles.caret, animatedStyles.caret]} />
          </View>
        )}
      </AnimatedCard>
    </Button>
  );
}

export type OTPInputHandle = {
  flashError: () => void;
};

type Props = {
  ref?: React.Ref<OTPInputHandle>;
  length?: number;
  onFilled?: (code: string) => void;
} & TextInputProps;

export default function OTPInput({
  length = 4,
  onFilled,
  ref,
  ...props
}: Props) {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(props.autoFocus ?? false);

  const textInputRef = useRef<TextInput>(null);

  const errorShared = useSharedValue(0);
  const shakeShared = useSharedValue(0);
  const caretOpacityShared = useSharedValue(0);

  const focusedIndex = text.length;
  const showCaret = isFocused && text.length !== length;

  const handleTextChange = (value: string) => {
    if (/[^\d]/.test(value)) return;
    setText(value);
    props.onChangeText?.(value);
    if (value.length === length) {
      onFilled?.(value);
      textInputRef.current?.blur();
    }
  };

  const handleFocus = (
    e: Parameters<NonNullable<TextInputProps["onFocus"]>>[0]
  ) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (
    e: Parameters<NonNullable<TextInputProps["onBlur"]>>[0]
  ) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  useImperativeHandle(
    ref,
    () => ({
      flashError: () => {
        errorShared.value = withSequence(
          withTiming(1, { duration: 200 }),
          withDelay(100, withTiming(0, { duration: 200 }))
        );

        shakeShared.value = withSequence(
          withTiming(8, { duration: 50 }),
          withTiming(-8, { duration: 50 }),
          withTiming(8, { duration: 50 }),
          withTiming(-8, { duration: 50 }),
          withTiming(8, { duration: 50 }),
          withTiming(0, { duration: 50 })
        );
      },
    }),
    [errorShared, shakeShared]
  );

  useEffect(() => {
    if (showCaret) {
      caretOpacityShared.value = withRepeat(
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
      caretOpacityShared.value = 0;
    }
  }, [caretOpacityShared, showCaret]);

  useEffect(() => {
    const subscription = Keyboard.addListener("keyboardDidHide", () => {
      textInputRef.current?.blur();
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      {Array(length)
        .fill(0)
        .map((_, index) => (
          <OTPInputBox
            key={`otp-input-box-${index}`}
            char={text.at(index) ?? ""}
            showCaret={showCaret && index === focusedIndex}
            isFocused={
              isFocused &&
              (index === focusedIndex ||
                (focusedIndex === length && index === length - 1))
            }
            error={errorShared}
            shake={shakeShared}
            caretOpacity={caretOpacityShared}
            onPress={() => textInputRef.current?.focus()}
          />
        ))}
      <TextInput
        value={text}
        onChangeText={handleTextChange}
        maxLength={length}
        inputMode="numeric"
        textContentType="oneTimeCode"
        ref={textInputRef}
        autoComplete={"one-time-code"}
        onFocus={handleFocus}
        onBlur={handleBlur}
        caretHidden
        style={styles.input}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 16,
  },
  card: {
    height: 100,
    padding: 12,
    paddingHorizontal: 16,
    gap: 4,
    alignItems: "center",
    justifyContent: "center",
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
