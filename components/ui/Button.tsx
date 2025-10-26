import React, { useEffect } from "react";
import getColor from "@/lib/ui/getColor";
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

type Variant = "primary" | "secondary" | "ghost" | "outline" | "text" | "base";
type Size = "sm" | "md" | "lg" | "xl" | "base";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props extends Omit<PressableProps, "children"> {
  asChild?: boolean;
  variant?: Variant;
  size?: Size;
  textProps?: Omit<TextProps, "children">;
  children?:
    | React.ReactNode
    | ((state: PressableStateCallbackType) => React.ReactNode);
}

export default function Button({
  asChild = false,
  variant = "primary",
  size = "md",
  children,
  textProps,
  style: incomingStyle,
  onPress,
  onPressIn,
  onPressOut,
  disabled,
  accessibilityRole = "button",
  ...restPressable
}: Props) {
  const isFunctionChild = typeof children === "function";
  const childArray = isFunctionChild
    ? []
    : (React.Children.toArray(children) ?? []);
  const shouldWrapInText =
    !isFunctionChild &&
    !asChild &&
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
        fontWeight: "700" as any,
        borderBottomWidth: 1,
        borderBottomColor: getColor("foreground"),
      },
    },
    base: {
      container: {
        borderRadius: undefined,
        justifyContent: undefined,
        alignItems: undefined,
        paddingHorizontal: undefined,
      },
      text: {
        fontWeight: undefined,
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
      container: { height: 40 },
      textDefaults: { size: "14" },
    },
    md: {
      container: { height: 56 },
      textDefaults: { size: "16" },
    },
    lg: {
      container: { height: 64 },
      textDefaults: { size: "18" },
    },
    xl: {},
    base: {},
  };

  const variantStyle = variantStyles[variant] ?? {};
  const sizeStyle = sizeStyles[size] ?? {};
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

  const innerPressIn: NonNullable<PressableProps["onPressIn"]> = () => {
    scale.value = withSpring(0.96, springConfig);
    opacity.value = withTiming(0.9, opacityTiming);
  };

  const innerPressOut: NonNullable<PressableProps["onPressOut"]> = () => {
    const now = Date.now();
    const elapsed = pressStartRef.current
      ? now - pressStartRef.current
      : MIN_PRESS_IN_MS;
    scheduleReleaseAnimation(elapsed);
  };

  const innerPress: NonNullable<PressableProps["onPress"]> = () => {
    const now = Date.now();
    const elapsed = pressStartRef.current
      ? now - pressStartRef.current
      : MIN_PRESS_IN_MS;
    scheduleReleaseAnimation(elapsed);
  };

  const childEl =
    asChild &&
    !isFunctionChild &&
    childArray.length === 1 &&
    React.isValidElement(childArray[0])
      ? (childArray[0] as React.ReactElement<any>)
      : null;

  const effectiveDisabled =
    asChild && childEl && "disabled" in (childEl.props ?? {})
      ? (childEl.props.disabled ?? disabled)
      : disabled;

  useEffect(() => {
    disabledOpacity.value = withTiming(effectiveDisabled ? 0.5 : 1);
  }, [effectiveDisabled, disabledOpacity]);

  useEffect(() => {
    return () => {
      clearOutTimer();
    };
  }, []);

  const defaultContainerStyle: PressableProps["style"] =
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

  if (asChild) {
    if (!childEl) {
      if (__DEV__) {
        console.warn(
          "Button(asChild): expects a single valid React element child. Received:",
          children
        );
      }
      return null;
    }

    const childOnPressIn = childEl.props?.onPressIn as
      | PressableProps["onPressIn"]
      | undefined;
    const childOnPressOut = childEl.props?.onPressOut as
      | PressableProps["onPressOut"]
      | undefined;
    const childOnPress = childEl.props?.onPress as
      | PressableProps["onPress"]
      | undefined;

    const handlePressIn: NonNullable<PressableProps["onPressIn"]> = (e) => {
      if (effectiveDisabled) return;
      clearOutTimer();
      pressStartRef.current = Date.now();
      childOnPressIn?.(e);
      onPressIn?.(e);
      innerPressIn(e);
    };

    const handlePressOut: NonNullable<PressableProps["onPressOut"]> = (e) => {
      if (effectiveDisabled) return;
      childOnPressOut?.(e);
      onPressOut?.(e);
      innerPressOut(e);
    };

    const handlePress: NonNullable<PressableProps["onPress"]> = (e) => {
      if (effectiveDisabled) return;
      childOnPress?.(e);
      onPress?.(e);
      innerPress(e);
    };

    const wrapperStyle: PressableProps["style"] = [animatedStyle];

    const clonedChild = React.cloneElement(childEl, {
      disabled:
        "disabled" in (childEl.props ?? {})
          ? effectiveDisabled
          : childEl.props?.disabled,
      onPressIn: undefined,
      onPressOut: undefined,
      onPress: undefined,
    });

    return (
      <AnimatedPressable
        {...restPressable}
        accessibilityRole={accessibilityRole}
        disabled={effectiveDisabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={wrapperStyle}
      >
        {clonedChild}
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      {...restPressable}
      accessibilityRole={accessibilityRole}
      disabled={effectiveDisabled}
      onPressIn={(e) => {
        if (effectiveDisabled) return;
        clearOutTimer();
        pressStartRef.current = Date.now();
        onPressIn?.(e);
        innerPressIn(e);
      }}
      onPressOut={(e) => {
        if (effectiveDisabled) return;
        onPressOut?.(e);
        innerPressOut(e);
      }}
      onPress={(e) => {
        if (effectiveDisabled) return;
        onPress?.(e);
        innerPress(e);
      }}
      style={defaultContainerStyle}
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
    fontWeight: "600" as any,
  },
});
