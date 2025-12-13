import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PressableProps, View } from "react-native";
import Button from "../ui/Button";
import getShadow from "@/lib/ui/getShadow";
import getColor from "@/lib/ui/getColor";
import { PlusIcon } from "lucide-react-native";

export default function TabsAddButton(pressableProps: PressableProps) {
  const { bottom } = useSafeAreaInsets();
  const size = 59 + Math.max(0, bottom / 2 - 10);

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
        <PlusIcon color={getColor("background")} size={28} />
      </Button>
    </View>
  );
}
