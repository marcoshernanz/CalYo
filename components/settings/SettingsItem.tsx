import { StyleSheet, View } from "react-native";
import Button from "../ui/Button";
import getColor from "@/lib/ui/getColor";
import { LucideIcon } from "lucide-react-native";
import Text from "../ui/Text";

type Props = {
  text: string;
  Icon: LucideIcon;
  onPress?: () => void;
  isLast?: boolean;
  destructive?: boolean;
};

export default function SettingsItem({
  text,
  Icon,
  onPress,
  isLast,
  destructive = false,
}: Props) {
  const color = destructive ? getColor("destructive") : getColor("foreground");

  return (
    <View style={[styles.container, !isLast && { borderBottomWidth: 1 }]}>
      <Button
        variant="base"
        size="base"
        style={styles.button}
        onPress={onPress}
      >
        <Icon size={18} color={color} />
        <Text size="16" weight="500" color={color}>
          {text}
        </Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderColor: getColor("muted"),
  },
  button: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
  },
});
