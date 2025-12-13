import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PressableProps, View } from "react-native";
import Button from "../ui/Button";
import getShadow from "@/lib/ui/getShadow";
import getColor from "@/lib/ui/getColor";
import { PlusIcon } from "lucide-react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

export default function TabsAddButton({
  isOpen,
  ...pressableProps
}: PressableProps & { isOpen?: boolean }) {
  const { bottom } = useSafeAreaInsets();
  const size = 59 + Math.max(0, bottom / 2 - 10);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: withTiming(isOpen ? "45deg" : "0deg", { duration: 200 }) },
      ],
    };
  });

  return (
    <View
      pointerEvents="box-none"
      style={{ flex: 1, alignItems: "center", top: -16 }}
    >
      <Button
        variant="primary"
        style={{ height: size, width: size, ...getShadow("sm") }}
        hitSlop={10}
        accessibilityLabel="Add"
        {...pressableProps}
      >
        <Animated.View style={animatedStyle}>
          <PlusIcon color={getColor("background")} size={28} />
        </Animated.View>
      </Button>
    </View>
  );
}
