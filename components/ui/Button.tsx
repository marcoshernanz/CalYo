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

function composeEventHandlers<E>(
  child?: ((e: E) => void) | undefined,
  parent?: ((e: E) => void) | undefined
) {
  return (e: E) => {
    child?.(e);
    parent?.(e);
  };
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

  const [isPressed, setIsPressed] = React.useState(false);

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
      // setIsPressed(false); TODO
      outTimerRef.current = null;
    }, wait);
  };

  const innerPressIn: NonNullable<PressableProps["onPressIn"]> = (e) => {
    scale.value = withSpring(0.96, springConfig);
    opacity.value = withTiming(0.9, opacityTiming);
    // setIsPressed(true); TODO
  };

  const innerPressOut: NonNullable<PressableProps["onPressOut"]> = (e) => {
    const now = Date.now();
    const elapsed = pressStartRef.current
      ? now - pressStartRef.current
      : MIN_PRESS_IN_MS;
    scheduleReleaseAnimation(elapsed);
  };

  const innerPress: NonNullable<PressableProps["onPress"]> = (e) => {
    const now = Date.now();
    const elapsed = pressStartRef.current
      ? now - pressStartRef.current
      : MIN_PRESS_IN_MS;
    scheduleReleaseAnimation(elapsed);
  };

  const handlePressIn: NonNullable<PressableProps["onPressIn"]> = (e) => {
    if (effectiveDisabled) return;
    onPressIn?.(e);
    clearOutTimer();
    pressStartRef.current = Date.now();
    innerPressIn(e);
  };

  const handlePressOut: NonNullable<PressableProps["onPressOut"]> = (e) => {
    if (effectiveDisabled) return;
    onPressOut?.(e);
    innerPressOut(e);
  };

  const handlePress: NonNullable<PressableProps["onPress"]> = (e) => {
    if (effectiveDisabled) return;
    onPress?.(e);
    innerPress(e);
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

  const baseContainerParts = [
    animatedStyle,
    styles.baseContainer,
    sizeStyle.container,
    variantStyle.container,
  ] as const;

  const composedContainerStyle: PressableProps["style"] =
    typeof incomingStyle === "function"
      ? (state) => [...baseContainerParts, incomingStyle(state)]
      : [...baseContainerParts, incomingStyle];

  if (asChild) {
    if (!childEl || isFunctionChild) {
      if (__DEV__) {
        console.warn(
          "Button(asChild): expects a single valid React element child. Received:",
          children
        );
      }
      return null;
    }

    const incomingResolved =
      typeof incomingStyle === "function"
        ? incomingStyle({ pressed: isPressed, hovered: false })
        : incomingStyle;

    const childStyleResolved =
      typeof childEl.props?.style === "function"
        ? childEl.props.style({
            pressed: isPressed,
            hovered: false,
            focused: false,
          })
        : childEl.props?.style;

    const mergedStyle = [
      ...baseContainerParts,
      incomingResolved,
      childStyleResolved,
    ];

    const mergedProps: any = {
      ...restPressable,
      disabled: effectiveDisabled,
      accessibilityRole,
      onPressIn: composeEventHandlers(childEl.props?.onPressIn, handlePressIn),
      onPressOut: composeEventHandlers(
        childEl.props?.onPressOut,
        handlePressOut
      ),
      onPress: composeEventHandlers(childEl.props?.onPress, handlePress),
      style: mergedStyle,
    };

    return React.cloneElement(childEl, mergedProps);
  }

  return (
    <AnimatedPressable
      {...restPressable}
      accessibilityRole={accessibilityRole}
      disabled={effectiveDisabled}
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
    fontWeight: "600" as any,
  },
});
