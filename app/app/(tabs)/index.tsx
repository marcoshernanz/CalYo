import CalyoLogo from "@/assets/svg/calyo-logo.svg";
import SafeArea from "@/components/ui/SafeArea";
import Text from "@/components/ui/Text";
import getColor from "@/lib/utils/getColor";
import { FlameIcon } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

export default function HomeScreen() {
  return (
    <SafeArea>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <CalyoLogo width={28} height={28} color={getColor("foreground")} />
          <Text size="28" style={styles.logoText}>
            CalYo
          </Text>
        </View>
        <View style={styles.streakContainer}>
          <FlameIcon
            size={22}
            color={getColor("orange")}
            fill={getColor("orange")}
          />
          <Text style={styles.streakText}>12</Text>
        </View>
      </View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  logoText: {
    fontWeight: 600,
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
  streakText: {
    fontWeight: 600,
  },
});
