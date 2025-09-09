import { StyleSheet, View } from "react-native";

interface Props {
  children: React.ReactNode;
}

export default function Header({ children }: Props) {
  return <View style={styles.header}>{children}</View>;
}

const styles = StyleSheet.create({
  header: {},
});
