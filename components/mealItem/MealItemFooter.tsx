import { StyleSheet } from "react-native";
import Button from "../ui/Button";
import SafeArea from "../ui/SafeArea";
import getShadow from "@/lib/ui/getShadow";
import { useRouter } from "expo-router";

export default function MealItemFooter() {
  const router = useRouter();

  return (
    <SafeArea edges={["bottom", "left", "right"]} style={styles.container}>
      <Button style={styles.button} onPress={() => router.back()}>
        Hecho
      </Button>
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
    ...invertedShadow,
  },
  button: {
    flex: 1,
    height: 48,
    flexDirection: "row",
    gap: 4,
  },
});
