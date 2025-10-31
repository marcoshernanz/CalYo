import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  interpolate,
  LinearTransition,
  runOnJS,
  SlideInUp,
  SlideOutUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "./Text";
import uuidv4 from "@/lib/utils/uuidv4";
import getColor from "@/lib/ui/getColor";
import getShadow from "@/lib/ui/getShadow";

export type ToastOptions = {
  text: string;
  variant?: "default" | "success" | "error";
};

type ToastItemType = ToastOptions & { id: string };

class ToastEmitter {
  private handlers: ((options: ToastOptions) => void)[] = [];

  on(handler: (options: ToastOptions) => void) {
    this.handlers.push(handler);
    return () => this.off(handler);
  }
  off(handler: (options: ToastOptions) => void) {
    this.handlers = this.handlers.filter((h) => h !== handler);
  }
  emit(options: ToastOptions) {
    this.handlers.forEach((h) => h(options));
  }
}

const emitter = new ToastEmitter();

export const Toast = {
  show(options: ToastOptions) {
    emitter.emit(options);
  },
};

export default function ToastProvider() {
  const [toasts, setToasts] = useState<ToastItemType[]>([]);
  const { top } = useSafeAreaInsets();

  useEffect(() => {
    const unsubscribe = emitter.on((options: ToastOptions) => {
      const id = uuidv4();
      const toast: ToastItemType = { id, ...options };
      setToasts((current) => [...current, toast]);

      const duration = 3000;
      setTimeout(
        () => setToasts((current) => current.filter((t) => t.id !== id)),
        duration
      );
    });

    return unsubscribe;
  }, []);

  return (
    <GestureHandlerRootView style={[styles.container, { top: top + 16 }]}>
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          {...toast}
          onDismiss={() =>
            setToasts((current) => current.filter((t) => t.id !== toast.id))
          }
        />
      ))}
    </GestureHandlerRootView>
  );
}

function ToastItem({
  text,
  variant = "default",
  onDismiss,
}: ToastItemType & { onDismiss: () => void }) {
  const colorMap = {
    default: "secondary",
    success: "green",
    error: "red",
  } as const;

  const translateY = useSharedValue(0);
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      if (event.translationY < -20) {
        runOnJS(onDismiss)();
      } else {
        translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
      }
    });
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: interpolate(translateY.value, [-100, 0], [0.5, 1]),
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        entering={SlideInUp.springify().damping(22).stiffness(200)}
        exiting={SlideOutUp.springify().damping(22).stiffness(200)}
        layout={LinearTransition.springify()}
        style={[
          styles.toast,
          { borderColor: colorMap[variant] },
          animatedStyle,
        ]}
      >
        <Text size="16" style={styles.text}>
          {text}
        </Text>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    gap: 8,
    alignItems: "center",
  },
  toast: {
    width: Dimensions.get("window").width - 32,
    padding: 12,
    backgroundColor: getColor("base"),
    borderRadius: 12,
    borderWidth: 1,
    ...getShadow("md"),
  },
  text: {
    textAlign: "center",
  },
});
