import { StyleSheet, View } from "react-native";
import CalYoLogo from "@/assets/svg/calyo-logo.svg";
import getColor from "@/lib/ui/getColor";
import Text from "../ui/Text";
import { FlameIcon } from "lucide-react-native";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import SafeArea from "../ui/SafeArea";

export default function HomeHeader() {
  const streak = useQuery(api.home.getStreak.default, {
    timezoneOffsetMinutes: new Date().getTimezoneOffset(),
  });

  return (
    <SafeArea edges={["left", "right"]} style={styles.safeArea}>
      <View style={styles.logoContainer}>
        <CalYoLogo width={28} height={28} color={getColor("foreground")} />
        <Text size="28" weight="600">
          CalYo
        </Text>
      </View>
      <Button variant="base" size="base">
        <Card style={styles.streakContainer}>
          <FlameIcon
            size={20}
            color={getColor("orange")}
            fill={getColor("orange")}
          />
          <Text weight="600">{streak ?? 0}</Text>
        </Card>
      </Button>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "transparent",
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
    paddingVertical: 8,
    paddingHorizontal: 10,
    gap: 2,
    borderRadius: 999,
    minWidth: 56,
  },
});
