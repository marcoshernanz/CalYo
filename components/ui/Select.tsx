import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import getColor from "@/lib/utils/getColor";
import { LucideIcon } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

interface Props {
  options: { name: string; label: string; Icon: LucideIcon }[];
  selectedOptions?: string[];
  onSelectOption?: (optionName: string) => void;
}

export default function Select({
  options,
  selectedOptions,
  onSelectOption,
}: Props) {
  return (
    <View style={styles.container}>
      {options.map(({ name, label, Icon }, index) => (
        <Button
          key={`option-${name}-${label}-${index}`}
          style={[
            styles.optionButton,
            {
              backgroundColor: selectedOptions?.includes(name)
                ? getColor("foreground")
                : getColor("secondary"),
            },
          ]}
          onPress={() => onSelectOption?.(name)}
        >
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <Icon color={getColor("foreground")} />
            </View>
          </View>
          <Text
            style={[
              styles.text,
              {
                color: selectedOptions?.includes(name)
                  ? getColor("background")
                  : getColor("foreground"),
              },
            ]}
          >
            {label}
          </Text>
        </Button>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    height: 80,
    width: "100%",
    borderRadius: 20,
  },
  iconContainer: {
    height: "100%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBackground: {
    backgroundColor: getColor("background"),
    height: 48,
    width: 48,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: 500,
  },
});
