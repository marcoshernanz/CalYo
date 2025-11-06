import { StyleSheet, View } from "react-native";
import Button from "../ui/Button";
import { useRouter } from "expo-router";
import { ArrowLeftIcon } from "lucide-react-native";
import Text from "../ui/Text";
import SafeArea from "../ui/SafeArea";
import getShadow from "@/lib/ui/getShadow";
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

type Props = {
  scrollY: SharedValue<number>;
};

export default function MealItemHeader({ scrollY }: Props) {
  const router = useRouter();

  const shadowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 24], [0, 1], Extrapolation.CLAMP),
  }));

  return (
    <SafeArea edges={["top", "left", "right"]} style={styles.safeArea}>
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFillObject, styles.shadow, shadowStyle]}
      />
      <View style={styles.container}>
        <Button
          size="sm"
          variant="secondary"
          style={styles.button}
          onPress={() => router.back()}
        >
          <ArrowLeftIcon size={22} />
        </Button>
        <View style={styles.title}>
          <Text size="18" weight="600">
            Ingrediente
          </Text>
        </View>
      </View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 0,
    zIndex: 10,
    paddingBottom: 16,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
  },
  button: {
    aspectRatio: 1,
  },
  title: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  shadow: {
    ...getShadow("lg"),
  },
});
