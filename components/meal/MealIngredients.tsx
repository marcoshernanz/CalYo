import { StyleSheet, View } from "react-native";
import Text from "../ui/Text";
import Card from "../ui/Card";
import getColor from "@/lib/ui/getColor";

interface Props {
  items: {
    name: string;
    calories: number;
    grams: number;
  }[];
}

export default function MealIngredients({ items }: Props) {
  return (
    <View>
      <View style={styles.headerContainer}>
        <Text>Ingredientes</Text>
        <Text>Añadir más</Text>
      </View>
      <View>
        {items.map((item, i) => (
          <Card key={`ingredient-${item.name}-${i}`} style={styles.card}>
            <View style={styles.cardLeftContent}>
              <Text
                size="14"
                weight="600"
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.foodName}
              >
                {item.name}
              </Text>
              <Text size="14">&middot;</Text>
              <Text size="14" color={getColor("mutedForeground")}>
                {item.calories} kcal
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
