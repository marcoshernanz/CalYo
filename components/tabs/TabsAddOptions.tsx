import { TriggerRef } from "@rn-primitives/popover";
import { useRef, useState } from "react";
import * as PopoverPrimitive from "@rn-primitives/popover";
import TabsAddButton from "./TabsAddButton";
import { Platform, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  Keyframe,
} from "react-native-reanimated";
import Card from "../ui/Card";
import Text from "../ui/Text";
import { LucideIcon, PenLineIcon, ScanIcon } from "lucide-react-native";
import getColor from "../../lib/ui/getColor";
import Button from "../ui/Button";
import { Href, useRouter } from "expo-router";
import { useRateLimit } from "@convex-dev/rate-limiter/react";
import { api } from "@/convex/_generated/api";
import { Toast } from "../ui/Toast";
import ProLabel from "../ProLabel";
import { useSubscriptionContext } from "@/context/SubscriptionContext";

const AnimatedPopoverContent = Animated.createAnimatedComponent(
  PopoverPrimitive.Content
);

const EnterAnimation = new Keyframe({
  0: {
    opacity: 0,
    transform: [{ translateY: 30 }, { scale: 0.9 }],
  },
  100: {
    opacity: 1,
    transform: [{ translateY: 0 }, { scale: 1 }],
    easing: Easing.out(Easing.cubic),
  },
}).duration(200);

const ExitAnimation = new Keyframe({
  0: {
    opacity: 1,
    transform: [{ translateY: 0 }, { scale: 1 }],
  },
  100: {
    opacity: 0,
    transform: [{ translateY: 30 }, { scale: 0.9 }],
    easing: Easing.in(Easing.cubic),
  },
}).duration(200);

type Option = {
  label: string;
  icon: LucideIcon;
  href: Href;
  isPro: boolean;
};

const options: Option[] = [
  {
    label: "Describir",
    icon: PenLineIcon,
    href: "/app/(add)/describe",
    isPro: true,
  },
  {
    label: "Escanear",
    icon: ScanIcon,
    href: "/app/(add)/camera",
    isPro: false,
  },
];

export default function TabsAddOptions() {
  const router = useRouter();
  const popoverTriggerRef = useRef<TriggerRef>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { isPro, navigateToPaywall } = useSubscriptionContext();
  const { status } = useRateLimit(api.rateLimit.getAiFeaturesRateLimit, {
    getServerTimeMutation: api.rateLimit.getServerTime,
  });

  const handleOptionPress = (option: Option) => {
    popoverTriggerRef.current?.close();

    if (!isPro) {
      if (Platform.OS === "android") {
        setTimeout(() => {
          navigateToPaywall();
        }, 200);
      } else {
        navigateToPaywall();
      }
      return;
    }

    if (status && !status.ok) {
      Toast.show({
        text: "Has alcanzado el límite diario de funciones de IA.",
        variant: "error",
      });
      return;
    }

    if (Platform.OS === "android") {
      setTimeout(() => {
        router.push(option.href);
      }, 200);
    } else {
      router.push(option.href);
    }
  };

  return (
    <PopoverPrimitive.Root onOpenChange={setIsOpen}>
      <PopoverPrimitive.Trigger asChild ref={popoverTriggerRef}>
        <TabsAddButton isOpen={isOpen} />
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Overlay style={StyleSheet.absoluteFill}>
          <Animated.View
            style={styles.overlay}
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
          />
          <AnimatedPopoverContent
            asChild
            align="center"
            side="top"
            entering={EnterAnimation}
            exiting={ExitAnimation}
          >
            <View style={styles.container}>
              {options.map((option, index) => (
                <Button
                  key={`option-${option.label}-${index}`}
                  variant="base"
                  size="base"
                  style={{ flex: 1, position: "relative" }}
                  onPress={() => {
                    handleOptionPress(option);
                  }}
                >
                  {option.isPro && <ProLabel />}
                  <Card style={styles.card}>
                    <option.icon size={28} color={getColor("foreground")} />
                    <Text size="14" weight="500">
                      {option.label}
                    </Text>
                  </Card>
                </Button>
              ))}
            </View>
          </AnimatedPopoverContent>
        </PopoverPrimitive.Overlay>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  container: {
    flexDirection: "row",
    gap: 16,
    padding: 16,
  },
  card: {
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
});
