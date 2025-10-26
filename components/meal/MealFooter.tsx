import { StyleSheet } from "react-native";
import Button from "../ui/Button";
import SafeArea from "../ui/SafeArea";
import getShadow from "@/lib/ui/getShadow";
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import { SparklesIcon } from "lucide-react-native";
import Text from "../ui/Text";
import getColor from "@/lib/ui/getColor";

interface Props {
  scrollY: SharedValue<number>;
  contentHeight: SharedValue<number>;
  layoutHeight: SharedValue<number>;
}

export default function MealFooter({
  scrollY,
  contentHeight,
  layoutHeight,
}: Props) {
  const router = useRouter();

  const shadowStyle = useAnimatedStyle(() => {
    const maxOffset = Math.max(contentHeight.value - layoutHeight.value, 0);
    const remaining = Math.max(maxOffset - scrollY.value, 0);
    const opacity = interpolate(
      remaining,
      [0, 24],
      [0, 1],
      Extrapolation.CLAMP
    );

    return { opacity };
  });

  return (
    <SafeArea edges={["bottom", "left", "right"]} style={styles.container}>
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFillObject, styles.shadow, shadowStyle]}
      />
      <Button style={styles.button} variant="outline">
        <SparklesIcon
          size={16}
          color={getColor("foreground")}
          fill={getColor("foreground")}
        />
        <Text size="16" weight="600">
          Arreglar
        </Text>
        {/* TODO: Nombre */}
      </Button>
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
    position: "relative",
    gap: 8,
  },
  button: {
    flex: 1,
    height: 48,
    flexDirection: "row",
    gap: 4,
  },
  shadow: invertedShadow,
});
