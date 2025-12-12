import { api } from "@/convex/_generated/api";
import { useRateLimit } from "@convex-dev/rate-limiter/react";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Toast } from "../ui/Toast";
import { PressableProps, View } from "react-native";
import Button from "../ui/Button";
import getShadow from "@/lib/ui/getShadow";
import getColor from "@/lib/ui/getColor";
import { PlusIcon } from "lucide-react-native";

export default function TabsAddButton(pressableProps: PressableProps) {
  const { bottom } = useSafeAreaInsets();
  const size = 59 + Math.max(0, bottom / 2 - 10);
  const router = useRouter();
  const { status } = useRateLimit(api.rateLimit.getAnalyzeMealPhotoRateLimit, {
    getServerTimeMutation: api.rateLimit.getServerTime,
  });

  // const handlePress = () => {
  //   if (status && !status.ok) {
  //     Toast.show({
  //       text: "Has alcanzado el límite diario de fotos.",
  //       variant: "error",
  //     });
  //     return;
  //   }

  //   router.push("/app/(home)/camera");
  // };

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
