import SafeArea from "../SafeArea";
import { StyleSheet, View } from "react-native";
import Button from "../Button";
import {
  ArrowLeftIcon,
  EllipsisVerticalIcon,
  LucideIcon,
} from "lucide-react-native";
import Text from "../Text";
import getShadow from "@/lib/ui/getShadow";
import { useRouter } from "expo-router";
import Popover, { PopoverOption } from "../Popover";
import { ComponentProps } from "react";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

export function ScreenHeader({
  children,
  scrollY,
}: {
  children: React.ReactNode;
  scrollY?: SharedValue<number>;
}) {
  const shadowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY?.value ?? 0,
      [0, 24],
      [0, 1],
      Extrapolation.CLAMP
    ),
  }));

  return (
    <SafeArea edges={["top", "left", "right"]} style={styles.safeArea}>
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFillObject, styles.shadow, shadowStyle]}
      />
      <View style={styles.container}>{children}</View>
    </SafeArea>
  );
}

export function ScreenHeaderButton({
  Icon,
  ...buttonProps
}: {
  Icon: LucideIcon;
} & ComponentProps<typeof Button>) {
  return (
    <Button
      size="sm"
      variant="secondary"
      style={styles.button}
      {...buttonProps}
    >
      <Icon size={22} />
    </Button>
  );
}

export function ScreenHeaderTitle({ title }: { title: string }) {
  return (
    <View style={styles.title}>
      <Text size="18" weight="600">
        {title}
      </Text>
    </View>
  );
}

export function ScreenHeaderBackButton() {
  const router = useRouter();

  return (
    <ScreenHeaderButton Icon={ArrowLeftIcon} onPress={() => router.back()} />
  );
}

export function ScreenHeaderActions({ options }: { options: PopoverOption[] }) {
  return (
    <Popover
      trigger={<ScreenHeaderButton Icon={EllipsisVerticalIcon} />}
      options={options}
    />
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
