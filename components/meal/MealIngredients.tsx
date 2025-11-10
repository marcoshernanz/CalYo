import { DimensionValue, StyleSheet, View } from "react-native";
import Text from "../ui/Text";
import Card from "../ui/Card";
import getColor from "@/lib/ui/getColor";
import Button from "../ui/Button";
import WithSkeleton from "../ui/WithSkeleton";
import { Link } from "expo-router";

type Item = {
  id: string;
  name: string;
  calories: number;
  grams: number;
};

type Props = {
  loading: boolean;
  items?: Item[];
};

const placeholderRows = 4;
const nameSkeletonWidths: DimensionValue[] = ["75%", "65%", "75%", "65%"];

export default function MealIngredients({ items = [], loading }: Props) {
  const count = loading
    ? Math.max(items.length, placeholderRows)
    : items.length;

  return (
    <View>
      <View style={styles.headerContainer}>
        <Text weight="600">Ingredientes</Text>
        {/* <Button
          variant="base"
          size="base"
          style={styles.addMoreButton}
          hitSlop={10}
        >
          <PlusIcon
            size={14}
            strokeWidth={2.25}
            color={getColor("mutedForeground")}
          />
          <Text size="14" color={getColor("mutedForeground")}>
            Añadir más
          </Text>
        </Button> */}
      </View>

      <View style={styles.ingredientsContainer}>
        {Array.from({ length: count }).map((_, i) => {
          const item: Item | undefined = items.at(i);
          const key = item
            ? `ingredient-${item.name}-${i}`
            : `ingredient-skeleton-${i}`;
          const nameWidth = nameSkeletonWidths[i % nameSkeletonWidths.length];

          return (
            <Link
              key={key}
              href={{
                pathname: "/app/mealItem",
                params: { mealItemId: item?.id },
              }}
              prefetch
              asChild
            >
              <Button variant="base" size="base">
                <Card style={styles.card}>
                  <WithSkeleton
                    loading={loading}
                    containerStyle={styles.cardLeftContent}
                    skeletonStyle={{
                      height: 14,
                      width: nameWidth,
                      borderRadius: 4,
                    }}
                  >
                    <View style={styles.cardLeftInner}>
                      <Text
                        size="14"
                        weight="600"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={styles.foodName}
                      >
                        {item?.name}
                      </Text>
                      <Text size="14">&middot;</Text>
                      <Text size="14" color={getColor("mutedForeground")}>
                        {item?.calories} kcal
                      </Text>
                    </View>
                  </WithSkeleton>

                  <WithSkeleton
                    loading={loading}
                    skeletonStyle={{
                      height: 14,
                      width: 32,
                      borderRadius: 4,
                      alignSelf: "flex-end",
                    }}
                  >
                    <Text size="14" weight="500">
                      {item?.grams} g
                    </Text>
                  </WithSkeleton>
                </Card>
              </Button>
            </Link>
          );
        })}
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
    flex: 1,
  },
  cardLeftInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    flexShrink: 1,
  },
  foodName: {
    flexShrink: 1,
  },
});
