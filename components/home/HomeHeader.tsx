import { StyleSheet, View } from "react-native";
import CalyoLogo from "@/assets/svg/calyo-logo.svg";
import getColor from "@/lib/ui/getColor";
import Text from "../ui/Text";
import { FlameIcon } from "lucide-react-native";
import Card from "../ui/Card";

export default function HomeHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <CalyoLogo width={28} height={28} color={getColor("foreground")} />
        <Text size="28" weight="600">
          CalYo
        </Text>
      </View>
      <Card style={styles.streakContainer}>
        <FlameIcon
          size={22}
          color={getColor("orange")}
          fill={getColor("orange")}
        />
        <Text weight="600">12</Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: getColor("background"),
    padding: 8,
    gap: 4,
    borderRadius: 999,
  },
});
