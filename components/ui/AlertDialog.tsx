import * as AlertDialogPrimitive from "@rn-primitives/alert-dialog";
import { StyleSheet, View, Pressable, useWindowDimensions } from "react-native";
import { useState } from "react";
import Card from "./Card";
import Text from "./Text";
import Button from "./Button";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  Keyframe,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedAlertDialogContent = Animated.createAnimatedComponent(
  AlertDialogPrimitive.Content
);

const ZoomIn = new Keyframe({
  0: {
    opacity: 0,
    transform: [{ scale: 0.9 }],
  },
  100: {
    opacity: 1,
    transform: [{ scale: 1 }],
    easing: Easing.out(Easing.cubic),
  },
}).duration(200);

const ZoomOut = new Keyframe({
  0: {
    opacity: 1,
    transform: [{ scale: 1 }],
  },
  100: {
    opacity: 0,
    transform: [{ scale: 0.9 }],
    easing: Easing.in(Easing.cubic),
  },
}).duration(200);

type Props = {
  trigger: React.ReactNode;
  title: string;
  description: string;
  onConfirm: () => void;
  destructive?: boolean;
};

export default function AlertDialog({
  trigger,
  title,
  description,
  onConfirm,
  destructive = false,
}: Props) {
  const dimensions = useWindowDimensions();

  const [open, setOpen] = useState(false);

  return (
    <AlertDialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <AlertDialogPrimitive.Trigger asChild>
        {trigger}
      </AlertDialogPrimitive.Trigger>
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay style={styles.overlay}>
          <AnimatedPressable
            style={styles.overlayPressable}
            onPress={() => {
              setOpen(false);
            }}
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
          />
          <AnimatedAlertDialogContent
            asChild
            entering={ZoomIn}
            exiting={ZoomOut}
          >
            <Card style={{ width: dimensions.width - 32 }}>
              <Text size="18" weight="600" style={styles.title}>
                {title}
              </Text>
              <Text size="14" style={styles.description}>
                {description}
              </Text>
              <View style={styles.buttonRow}>
                <Button
                  variant="secondary"
                  size="sm"
                  style={styles.button}
                  onPress={() => {
                    setOpen(false);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant={destructive ? "destructive" : "primary"}
                  size="sm"
                  style={styles.button}
                  onPress={() => {
                    setOpen(false);
                    onConfirm();
                  }}
                >
                  Confirmar
                </Button>
              </View>
            </Card>
          </AnimatedAlertDialogContent>
        </AlertDialogPrimitive.Overlay>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  overlayPressable: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  title: {
    paddingBottom: 8,
  },
  description: {
    paddingBottom: 24,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    flex: 1,
  },
});
