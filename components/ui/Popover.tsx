import { StyleSheet } from "react-native";
import Button from "./Button";
import Card from "./Card";
import getShadow from "@/lib/ui/getShadow";

interface Props {
  options: {
    Item: React.ReactNode;
    onPress: () => void;
  }[];
}

export default function Popover({ options }: Props) {
  return (
    <Card style={styles.card}>
      {options.map((option, index) => (
        <Button
          variant="base"
          size="sm"
          key={`popover-option-${index}`}
          onPress={option.onPress}
          style={styles.button}
        >
          {option.Item}
        </Button>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    top: "100%",
    right: 0,
    zIndex: 100,
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
