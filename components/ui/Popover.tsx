import { StyleSheet, View } from "react-native";
import Card from "./Card";
import getShadow from "@/lib/ui/getShadow";
import * as PopoverPrimitive from "@rn-primitives/popover";
import Button from "./Button";
import { useRef } from "react";
import { TriggerRef } from "@rn-primitives/popover";
import Animated, { Easing, Keyframe } from "react-native-reanimated";
import { LucideIcon } from "lucide-react-native";
import getColor from "@/lib/ui/getColor";
import Text from "./Text";

const AnimatedPopoverContent = Animated.createAnimatedComponent(
  PopoverPrimitive.Content
);

const EnterFromTopRight = new Keyframe({
  0: {
    opacity: 0,
    transform: [{ translateX: 5 }, { translateY: -10 }, { scale: 0.9 }],
  },
  100: {
    opacity: 1,
    transform: [{ translateX: 0 }, { translateY: 0 }, { scale: 1 }],
    easing: Easing.out(Easing.cubic),
  },
}).duration(200);

const ExitToTopRight = new Keyframe({
  0: {
    opacity: 1,
    transform: [{ translateX: 0 }, { translateY: 0 }, { scale: 1 }],
  },
  100: {
    opacity: 0,
    transform: [{ translateX: 5 }, { translateY: -10 }, { scale: 0.9 }],
    easing: Easing.in(Easing.cubic),
  },
}).duration(200);

export type PopoverOption = {
  Icon: LucideIcon;
  text: string;
  onPress: () => void;
  destructive?: boolean;
};

type Props = {
  trigger: React.ReactNode;
  options: PopoverOption[];
  width?: number;
};

export default function Popover({ trigger, options, width = 160 }: Props) {
  const popoverTriggerRef = useRef<TriggerRef>(null);

  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild ref={popoverTriggerRef}>
        {trigger}
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Overlay style={StyleSheet.absoluteFill}>
          <AnimatedPopoverContent
            asChild
            align="end"
            side="bottom"
            entering={EnterFromTopRight}
            exiting={ExitToTopRight}
          >
            <Card style={[styles.card, { minWidth: width }]}>
              {options.map((option, index) => (
                <Button
                  variant="base"
                  size="sm"
                  key={`popover-option-${option.text}-${index}`}
                  onPress={() => {
                    option.onPress();
                    popoverTriggerRef.current?.close();
                  }}
                  style={styles.button}
                >
                  <View style={styles.optionContainer}>
                    <option.Icon
                      size={16}
                      strokeWidth={2.25}
                      color={
                        option.destructive
                          ? getColor("red")
                          : getColor("foreground")
                      }
                    />
                    <Text
                      size="16"
                      weight="500"
                      color={
                        option.destructive
                          ? getColor("red")
                          : getColor("foreground")
                      }
                    >
                      {option.text}
                    </Text>
                  </View>
                </Button>
              ))}
            </Card>
          </AnimatedPopoverContent>
        </PopoverPrimitive.Overlay>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 0,
    ...getShadow("md"),
  },
  button: {
    justifyContent: "center",
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 16,
  },
  optionContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },
});
