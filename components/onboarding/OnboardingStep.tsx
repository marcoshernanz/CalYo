import { StyleSheet, View } from "react-native";
import SafeArea from "../ui/SafeArea";
import Title from "../ui/Title";

interface Props {
  children: React.ReactNode;
  title: string;
}

export default function OnboardingStep({ children, title }: Props) {
  return (
    <SafeArea style={styles.safeArea} edges={["left", "right"]}>
      <Title size="24">{title}</Title>
      <View style={styles.content}>{children}</View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    paddingVertical: 0,
    gap: 36,
  },
  content: {
    flex: 1,
    gap: 36,
  },
});
