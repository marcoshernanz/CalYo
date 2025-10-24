import { StyleSheet, View } from "react-native";
import Button from "../ui/Button";
import { useRouter } from "expo-router";
import { ArrowLeftIcon, EllipsisVerticalIcon } from "lucide-react-native";
import Text from "../ui/Text";
import { Id } from "@/convex/_generated/dataModel";

interface Props {
  mealId: Id<"meals">;
}

export default function MealHeader({ mealId }: Props) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Button
        size="sm"
        variant="secondary"
        style={styles.button}
        onPress={() => router.back()}
      >
        <ArrowLeftIcon size={22} />
      </Button>
      <View style={styles.title}>
        <Text size="18" weight="600">
          Nutrición
        </Text>
      </View>
      <Button size="sm" variant="secondary" style={styles.button}>
        <EllipsisVerticalIcon size={22} />
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingBottom: 16,
  },
  button: {
    aspectRatio: 1,
  },
  title: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
