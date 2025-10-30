import { Pressable, StyleSheet } from "react-native";
import { ReactNode } from "react";
import Button from "./Button";
import Card from "./Card";
import getShadow from "@/lib/ui/getShadow";

interface Props {
  options: {
    Item: ReactNode;
    onPress: () => void;
  }[];
  visible: boolean;
  onClose: () => void;
}

export default function Popover({ options, visible, onClose }: Props) {
  if (!visible) {
    return null;
  }

  return (
    <>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <Card style={styles.card}>
        {options.map((option, index) => (
          <Button
            variant="base"
            size="sm"
            key={`popover-option-${index}`}
            onPress={() => {
              try {
                option.onPress();
              } finally {
                onClose();
              }
            }}
            style={styles.button}
          >
            {option.Item}
          </Button>
        ))}
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    position: "absolute",
    top: "100%",
    right: 0,
    zIndex: 101,
    width: 140,
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
