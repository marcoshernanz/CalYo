import getColor from "@/lib/ui/getColor";
import getShadow from "@/lib/ui/getShadow";
import { StyleSheet, View, ViewProps } from "react-native";

interface Props extends ViewProps {
  children: React.ReactNode;
}

export default function Card({ children, style, ...props }: Props) {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: getColor("base"),
    padding: 20,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: getColor("secondary"),
    ...getShadow("sm"),
  },
});
