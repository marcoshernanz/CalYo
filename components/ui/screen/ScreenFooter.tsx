import { StyleSheet, ViewStyle } from "react-native";
import Button from "../Button";
import SafeArea from "../SafeArea";
import getColor from "@/lib/ui/getColor";
import getShadow from "@/lib/ui/getShadow";
import { ComponentProps } from "react";
import Text from "../Text";
import { LucideIcon, LucideProps } from "lucide-react-native";

export function ScreenFooter({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <SafeArea
      edges={["bottom", "left", "right"]}
      style={[styles.container, style]}
    >
      {children}
    </SafeArea>
  );
}

export function ScreenFooterButton(props: ComponentProps<typeof Button>) {
  return <Button style={styles.button} {...props} />;
}

export function ScreenFooterButtonText({ text }: { text: string }) {
  return (
    <Text size="16" weight="600">
      {text}
    </Text>
  );
}

export function ScreenFooterButtonIcon({
  Icon,
  ...props
}: {
  Icon: LucideIcon;
} & LucideProps) {
  return <Icon size={16} color={getColor("foreground")} {...props} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    zIndex: 10,
    flexDirection: "row",
    paddingTop: 12,
    gap: 8,
    ...getShadow("lg", { inverted: true }),
  },
  button: {
    flex: 1,
    height: 48,
    flexDirection: "row",
    gap: 4,
  },
});
