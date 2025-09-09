import React from "react";
import getColor from "@/lib/utils/getColor";
import {
  Pressable,
  PressableProps,
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

interface Props {
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
  pressableProps?: Omit<PressableProps, "children">;
  textProps?: Omit<TextProps, "children">;
}

export default function Button({
  variant = "primary",
  size = "md",
  children,
  pressableProps,
  textProps,
}: Props) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

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
        fontWeight: 600,
      },
    },
    secondary: {},
    ghost: {},
    outline: {},
    text: {
      text: {
        color: getColor("foreground"),
        fontWeight: 700,
        borderBottomWidth: 1,
        borderBottomColor: getColor("foreground"),
        paddingBottom: 1,
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
    sm: {},
    md: {
      textDefaults: {
        size: "18",
      },
    },
    lg: {
      container: {
        height: 66,
      },
      textDefaults: {
        size: "20",
      },
    },
    xl: {},
  };

  const incomingStyle = pressableProps?.style;
  const variantStyle = variantStyles[variant] ?? {};
  const sizeStyle = sizeStyles[size] ?? {};

  const composedContainerStyle: PressableProps["style"] =
    typeof incomingStyle === "function"
      ? (state) => [
          animatedStyle,
          styles.baseContainer,
          variantStyle.container,
          sizeStyle.container,
          incomingStyle(state),
        ]
      : [
          animatedStyle,
          styles.baseContainer,
          variantStyle.container,
          sizeStyle.container,
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
  const handlePressIn: NonNullable<PressableProps["onPressIn"]> = (e) => {
    pressableProps?.onPressIn?.(e);
    scale.value = withSpring(0.96, springConfig);
    opacity.value = withTiming(0.9, opacityTiming);
  };

  const handlePressOut: NonNullable<PressableProps["onPressOut"]> = (e) => {
    pressableProps?.onPressOut?.(e);
    scale.value = withSpring(1, springConfig);
    opacity.value = withTiming(1, opacityTiming);
  };

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  return (
    <AnimatedPressable
      {...pressableProps}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={composedContainerStyle}
    >
      <Text
        {...defaultTextPropsFromSize}
        {...textProps}
        style={composedTextStyle}
      >
        {children}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  baseContainer: {
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },
  baseText: {},
});
