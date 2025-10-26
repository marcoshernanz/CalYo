import { StyleSheet, View } from "react-native";
import Text from "../ui/Text";
import Card from "../ui/Card";
import getColor from "@/lib/ui/getColor";
import { PlusIcon } from "lucide-react-native";
import Button from "../ui/Button";

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
        <Text weight="600">Ingredientes</Text>
        <Button variant="base" size="base" style={styles.addMoreButton}>
          <PlusIcon
            size={14}
            strokeWidth={2.25}
            color={getColor("mutedForeground")}
          />
          <Text size="14" color={getColor("mutedForeground")}>
            Añadir más
          </Text>
        </Button>
      </View>
      <View style={styles.ingredientsContainer}>
        {items.map((item, i) => (
          <Button key={`ingredient-${item.name}-${i}`} asChild>
            <Card style={styles.card}>
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
          </Button>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
  },
  addMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  ingredientsContainer: {
    gap: 8,
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
