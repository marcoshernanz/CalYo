import { PlusIcon } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Button from "@/components/ui/Button";
import getColor from "@/lib/ui/getColor";
import { useRouter } from "expo-router";
import getShadow from "@/lib/ui/getShadow";

export default function TabsAddButton() {
  const router = useRouter();

  const { bottom: bottomInset } = useSafeAreaInsets();
  const tabsHeight = 49 + bottomInset;
  const size = 59 + Math.max(0, bottomInset / 2 - 10);
  const paddingBottom = Math.max(4, tabsHeight - size + 10);

  return (
    <View
      pointerEvents="box-none"
      style={[styles.container, { paddingBottom }]}
    >
      <Button
        variant="primary"
        style={[styles.button, { height: size, width: size }]}
        onPress={() => router.navigate("/app/camera")}
      >
        <PlusIcon color={getColor("background")} size={32} />
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  button: {
    ...getShadow("sm"),
  },
});
