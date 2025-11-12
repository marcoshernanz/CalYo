import { StyleSheet, View } from "react-native";
import Title from "../ui/Title";

type Props = {
  children: React.ReactNode;
  title: string;
};

export default function OnboardingStep({ children, title }: Props) {
  return (
    <View style={styles.container}>
      <Title size="24">{title}</Title>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 36,
  },
  content: {
    flex: 1,
    gap: 36,
  },
});
