import { StyleSheet } from "react-native";
import { Text } from "./Text";

interface Props {
  children: React.ReactNode;
}

export default function Title({ children }: Props) {
  return <Text style={styles.title}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {},
});
