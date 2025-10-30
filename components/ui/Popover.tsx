import { StyleSheet, View } from "react-native";
import Card from "./Card";
import getShadow from "@/lib/ui/getShadow";
import * as PopoverPrimitive from "@rn-primitives/popover";
import Button from "./Button";
import { useRef } from "react";
import { TriggerRef } from "@rn-primitives/popover";
import Animated, { Easing, Keyframe } from "react-native-reanimated";

interface Props {
  trigger: React.ReactNode;
  options: { Item: React.ReactNode; onPress: () => void }[];
  width?: number;
}

const AnimatedCard = Animated.createAnimatedComponent(Card);

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
}).duration(500);

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
}).duration(500);

export default function Popover({ trigger, options, width = 160 }: Props) {
  const popoverTriggerRef = useRef<TriggerRef>(null);

  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild ref={popoverTriggerRef}>
        {trigger}
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Overlay style={StyleSheet.absoluteFill} />
        <PopoverPrimitive.Content asChild align="end" side="bottom">
          <View collapsable={false}>
            <AnimatedCard
              style={[styles.card, { minWidth: width }]}
              entering={EnterFromTopRight}
              exiting={ExitToTopRight}
            >
              {options.map((option, index) => (
                <Button
                  variant="base"
                  size="sm"
                  key={`popover-option-${index}`}
                  onPress={() => {
                    // option.onPress(); // if needed
                    popoverTriggerRef.current?.close();
                  }}
                  style={styles.button}
                >
                  {option.Item}
                </Button>
              ))}
            </AnimatedCard>
          </View>
        </PopoverPrimitive.Content>
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
});
