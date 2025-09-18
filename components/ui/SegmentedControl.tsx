import { StyleSheet, View } from "react-native";
import Button from "./Button";
import getColor from "@/lib/utils/getColor";

interface Props {
  options: string[];
  selectedOption: string;
  onChange: (option: string) => void;
}

export default function SegmentedControl({
  options,
  selectedOption,
  onChange,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        {options.map((option, index) => (
          <Button
            key={`option-${option}-${index}`}
            size="sm"
            variant="ghost"
            style={{
              backgroundColor:
                selectedOption === option
                  ? getColor("foreground")
                  : "transparent",
            }}
            textProps={{
              style: {
                color:
                  selectedOption === option
                    ? getColor("background")
                    : getColor("foreground"),
              },
            }}
            onPress={() => onChange(option)}
          >
            {option}
          </Button>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    height: 40,
    backgroundColor: getColor("secondary"),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
  },
});
