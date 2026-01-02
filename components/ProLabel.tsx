import { useSubscriptionContext } from "@/context/SubscriptionContext";
import { StyleSheet, View } from "react-native";
import Text from "./ui/Text";
import getColor from "@/lib/ui/getColor";

export default function ProLabel() {
  const { isPro } = useSubscriptionContext();

  if (isPro) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text size="12" weight="600" color={getColor("background")}>
        Pro
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 8,
    left: 8,
    zIndex: 1,
    backgroundColor: getColor("primary"),
    borderRadius: 999,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
});
