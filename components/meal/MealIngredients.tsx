import { StyleSheet, View } from "react-native";
import Text from "../ui/Text";
import Card from "../ui/Card";
import getColor from "@/lib/ui/getColor";
import { PlusIcon } from "lucide-react-native";
import Button from "../ui/Button";
import Skeleton from "../ui/Skeleton";

interface Props {
  loading: boolean;
  items?: {
    name: string;
    calories: number;
    grams: number;
  }[];
}

export default function MealIngredients({ items = [], loading }: Props) {
  return (
    <View>
      <View style={styles.headerContainer}>
        <Text weight="600">Ingredientes</Text>
        <Button
          variant="base"
          size="base"
          style={styles.addMoreButton}
          disabled={loading}
        >
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
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={`ingredient-skeleton-${i}`} style={styles.card}>
                <View style={styles.cardLeftContent}>
                  <Skeleton
                    style={{ height: 14, width: 140, borderRadius: 4 }}
                  />
                  <Text size="14">&middot;</Text>
                  <Skeleton
                    style={{ height: 14, width: 60, borderRadius: 4 }}
                  />
                </View>
                <Skeleton style={{ height: 14, width: 50, borderRadius: 4 }} />
              </Card>
            ))
          : items.map((item, i) => (
              <Button
                key={`ingredient-${item.name}-${i}`}
                variant="base"
                size="base"
              >
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
