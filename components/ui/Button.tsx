import React, { useEffect } from "react";
import getColor from "@/lib/utils/getColor";
import {
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Text, { TextProps } from "./Text";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "text";
type Size = "sm" | "md" | "lg" | "xl";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props extends Omit<PressableProps, "children"> {
  variant?: Variant;
  size?: Size;
  textProps?: Omit<TextProps, "children">;
  children?:
    | React.ReactNode
    | ((state: PressableStateCallbackType) => React.ReactNode);
}

export default function Button({
  variant = "primary",
  size = "md",
  children,
  textProps,
  style: incomingStyle,
  onPress,
  onPressIn,
  onPressOut,
  disabled,
  ...restPressable
}: Props) {
  const isFunctionChild = typeof children === "function";
  const childArray = isFunctionChild
    ? []
    : (React.Children.toArray(children) ?? []);
  const shouldWrapInText =
    !isFunctionChild &&
    childArray.length > 0 &&
    childArray.every((c) => typeof c === "string" || typeof c === "number");
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const disabledOpacity = useSharedValue(disabled ? 0.5 : 1);
  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: scale.value }],
      opacity: disabledOpacity.value * opacity.value,
    }),
    []
  );

  const variantStyles: Record<
    Variant,
    { container?: ViewStyle; text?: TextStyle }
  > = {
    primary: {
      container: {
        backgroundColor: getColor("foreground"),
      },
      text: {
        color: getColor("background"),
      },
    },
    secondary: {
      container: {
        backgroundColor: getColor("secondary"),
      },
      text: {
        color: getColor("foreground"),
      },
    },
    ghost: {},
    outline: {
      container: {
        borderWidth: 1,
        borderColor: getColor("foreground"),
        backgroundColor: getColor("background"),
      },
      text: {
        color: getColor("foreground"),
      },
    },
    text: {
      container: {
        height: "auto",
        paddingHorizontal: 0,
      },
      text: {
        color: getColor("foreground"),
        fontWeight: 700,
        borderBottomWidth: 1,
        borderBottomColor: getColor("foreground"),
      },
    },
  };

  const sizeStyles: Record<
    Size,
    {
      container?: ViewStyle;
      text?: TextStyle;
      textDefaults?: Partial<TextProps>;
    }
  > = {
    sm: {
      container: {
        height: 40,
      },
      textDefaults: {
        size: "14",
      },
    },
    md: {
      container: {
        height: 56,
      },
      textDefaults: {
        size: "16",
      },
    },
    lg: {
      container: {
        height: 64,
      },
      textDefaults: {
        size: "18",
      },
    },
    xl: {},
  };

  const variantStyle = variantStyles[variant] ?? {};
  const sizeStyle = sizeStyles[size] ?? {};

  const composedContainerStyle: PressableProps["style"] =
    typeof incomingStyle === "function"
      ? (state) => [
          animatedStyle,
          styles.baseContainer,
          sizeStyle.container,
          variantStyle.container,
          incomingStyle(state),
        ]
      : [
          animatedStyle,
          styles.baseContainer,
          sizeStyle.container,
          variantStyle.container,
          incomingStyle,
        ];

  const defaultTextPropsFromSize = sizeStyle.textDefaults ?? {};
  const composedTextStyle = [
    styles.baseText,
    variantStyle.text,
    sizeStyle.text,
    textProps?.style,
  ] as TextProps["style"];

  const springConfig = { stiffness: 500, damping: 30, mass: 0.9 } as const;
  const opacityTiming = { duration: 120 } as const;
  const MIN_PRESS_IN_MS = 120;
  const pressStartRef = React.useRef<number | null>(null);
  const outTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearOutTimer = () => {
    if (outTimerRef.current) {
      clearTimeout(outTimerRef.current);
      outTimerRef.current = null;
    }
  };

  const scheduleReleaseAnimation = (elapsedSincePressStart: number) => {
    clearOutTimer();
    const wait = Math.max(0, MIN_PRESS_IN_MS - elapsedSincePressStart);
    outTimerRef.current = setTimeout(() => {
      scale.value = withSpring(1, springConfig);
      opacity.value = withTiming(1, opacityTiming);
      outTimerRef.current = null;
    }, wait);
  };

  const handlePressIn: NonNullable<PressableProps["onPressIn"]> = (e) => {
    if (disabled) return;
    onPressIn?.(e);
    clearOutTimer();
    pressStartRef.current = Date.now();
    scale.value = withSpring(0.96, springConfig);
    opacity.value = withTiming(0.9, opacityTiming);
  };

  const handlePressOut: NonNullable<PressableProps["onPressOut"]> = (e) => {
    if (disabled) return;
    onPressOut?.(e);
    const now = Date.now();
    const elapsed = pressStartRef.current
      ? now - pressStartRef.current
      : MIN_PRESS_IN_MS;
    scheduleReleaseAnimation(elapsed);
  };

  const handlePress: NonNullable<PressableProps["onPress"]> = (e) => {
    if (disabled) return;
    onPress?.(e);
    const now = Date.now();
    const elapsed = pressStartRef.current
      ? now - pressStartRef.current
      : MIN_PRESS_IN_MS;
    scheduleReleaseAnimation(elapsed);
  };

  useEffect(() => {
    disabledOpacity.value = withTiming(disabled ? 0.5 : 1);
  }, [disabled, disabledOpacity]);

  useEffect(() => {
    return () => {
      clearOutTimer();
    };
  }, []);

  return (
    <AnimatedPressable
      {...restPressable}
      disabled={disabled}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={composedContainerStyle}
    >
      {shouldWrapInText ? (
        <Text
          {...defaultTextPropsFromSize}
          {...textProps}
          style={composedTextStyle}
        >
          {children as React.ReactNode}
        </Text>
      ) : (
        children
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  baseContainer: {
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  baseText: {
    fontWeight: 600,
  },
});
