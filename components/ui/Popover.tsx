import { StyleSheet, View } from "react-native";
import Card from "./Card";
import getShadow from "@/lib/ui/getShadow";
import * as PopoverPrimitive from "@rn-primitives/popover";
import Button from "./Button";
import { useRef } from "react";
import { TriggerRef } from "@rn-primitives/popover";
import Animated, {
  ZoomInEasyUp,
  ZoomOutEasyDown,
} from "react-native-reanimated";

interface Props {
  trigger: React.ReactNode;
  options: { Item: React.ReactNode; onPress: () => void }[];
  width?: number;
}

const AnimatedCard = Animated.createAnimatedComponent(Card);

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
              entering={ZoomInEasyUp.duration(250)}
              exiting={ZoomOutEasyDown.duration(250)}
            >
              {options.map((option, index) => (
                <Button
                  variant="base"
                  size="sm"
                  key={`popover-option-${index}`}
                  onPress={() => {
                    // option.onPress(); TODO
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
