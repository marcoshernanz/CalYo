import { StyleSheet } from "react-native";
import Button from "../ui/Button";
import SafeArea from "../ui/SafeArea";
import getShadow from "@/lib/ui/getShadow";
import { Link } from "expo-router";
import { SparklesIcon } from "lucide-react-native";
import Text from "../ui/Text";
import getColor from "@/lib/ui/getColor";

export default function MealFooter() {
  return (
    <SafeArea edges={["bottom", "left", "right"]} style={styles.container}>
      <Button style={styles.button} variant="outline">
        <SparklesIcon
          size={16}
          color={getColor("foreground")}
          fill={getColor("foreground")}
        />
        <Text size="16" weight="600">
          Corregir
        </Text>
      </Button>
      <Link href="/app" asChild>
        <Button style={styles.button}>Hecho</Button>
      </Link>
    </SafeArea>
  );
}

const baseShadow = getShadow("lg");
const invertedShadow = Array.isArray(baseShadow.boxShadow)
  ? {
      ...baseShadow,
      boxShadow: baseShadow.boxShadow.map((layer: any) => ({
        ...layer,
        offsetY: -layer.offsetY,
      })),
    }
  : baseShadow;

const styles = StyleSheet.create({
  container: {
    flex: 0,
    zIndex: 10,
    flexDirection: "row",
    paddingTop: 12,
    position: "relative",
    gap: 8,
    ...invertedShadow,
  },
  button: {
    flex: 1,
    height: 48,
    flexDirection: "row",
    gap: 4,
  },
});
