import { StyleSheet, View } from "react-native";
import Text from "../ui/Text";
import Card from "../ui/Card";
import getColor from "@/lib/ui/getColor";
import macrosToKcal from "@/lib/utils/macrosToKcal";

const items = [
  {
    food: {
      description: {
        en: "Chicken Breast",
      },
    },
    nutrients: {
      protein: 31,
      fat: 3.6,
      carbs: 0,
    },
    grams: 150,
  },
  {
    food: {
      description: {
        en: "Brown Rice",
      },
    },
    nutrients: {
      protein: 2.6,
      fat: 0.9,
      carbs: 23,
    },
    grams: 200,
  },
];

export default function MealIngredients() {
  return (
    <View>
      <View style={styles.headerContainer}>
        <Text>Ingredientes</Text>
        <Text>Añadir más</Text>
      </View>
      <View>
        {items.map((item, i) => (
          <Card key={i} style={styles.card}>
            <View style={styles.cardLeftContent}>
              <Text
                size="14"
                weight="600"
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.foodName}
              >
                {item.food?.description.en}
              </Text>
              <Text size="14">&middot;</Text>
              <Text size="14" color={getColor("mutedForeground")}>
                {macrosToKcal(item.nutrients)} kcal
              </Text>
            </View>
            <Text size="14" weight="500">
              {item.grams} g
            </Text>
          </Card>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    gap: 20,
  },
  cardLeftContent: {
    flexDirection: "row",
    gap: 6,
    flex: 1,
    flexShrink: 1,
  },
  foodName: {
    flexShrink: 1,
  },
});
