import { StyleSheet } from "react-native";
import Card from "./Card";
import getShadow from "@/lib/ui/getShadow";
import * as PopoverPrimitive from "@rn-primitives/popover";
import Button from "./Button";
import { useRef } from "react";
import { TriggerRef } from "@rn-primitives/popover";

interface Props {
  trigger: React.ReactNode;
  options: { Item: React.ReactNode; onPress: () => void }[];
  width?: number;
}

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
          <Card style={[styles.card]}>
            {options.map((option, index) => (
              <Button
                variant="base"
                size="sm"
                key={`popover-option-${index}`}
                onPress={() => {
                  // option.onPress();
                  // onClose();
                  popoverTriggerRef.current?.close();
                }}
                style={styles.button}
              >
                {option.Item}
              </Button>
            ))}
          </Card>
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
