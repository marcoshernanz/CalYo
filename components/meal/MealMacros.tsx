import { StyleSheet, View } from "react-native";
import Card from "../ui/Card";
import getColor from "@/lib/ui/getColor";
import { FlameIcon } from "lucide-react-native";
import Text from "../ui/Text";

export default function MealMacros() {
  return (
    <View style={styles.container}>
      <Card style={styles.caloriesCard}>
        <View style={styles.caloriesIconContainer}>
          <FlameIcon />
        </View>
        <View style={styles.caloriesTextContainer}>
          <Text size="12" color={getColor("mutedForeground")}>
            Calorías
          </Text>
          <Text size="24" weight="700">
            324 kcal
          </Text>
        </View>
      </Card>
      <View style={styles.macrosContainer}>
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <Card key={index} style={styles.macroCard}>
              <Text size="12" color={getColor("mutedForeground")}>
                Proteína
              </Text>
              <View style={styles.macroValueContainer}>
                <View style={styles.macroIconContainer}>
                  <FlameIcon size={14} />
                </View>
                <Text size="16" weight="600">
                  32 g
                </Text>
              </View>
            </Card>
          ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  caloriesCard: {
    flexDirection: "row",
    gap: 12,
    padding: 12,
  },
  caloriesIconContainer: {
    height: 64,
    width: 64,
    borderRadius: 16,
    backgroundColor: getColor("muted"),
    alignItems: "center",
    justifyContent: "center",
  },
  caloriesTextContainer: {
    justifyContent: "center",
  },
  macrosContainer: {
    flexDirection: "row",
    gap: 6,
  },
  macroCard: {
    flex: 1,
    padding: 12,
    gap: 8,
    alignItems: "center",
  },
  macroValueContainer: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  macroIconContainer: {
    height: 22,
    width: 22,
    borderRadius: 16,
    backgroundColor: getColor("muted"),
    alignItems: "center",
    justifyContent: "center",
  },
});
