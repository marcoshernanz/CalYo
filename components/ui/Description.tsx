import { StyleSheet } from "react-native";
import { Text } from "./Text";

interface Props {
  children: React.ReactNode;
}

export default function Description({ children }: Props) {
  return <Text style={styles.description}>{children}</Text>;
}

const styles = StyleSheet.create({
  description: {},
});
