import { StyleSheet, View } from "react-native";
import Text from "../ui/Text";
import { format } from "date-fns";
import CalorieIcon from "../icons/macros/CalorieIcon";
import CarbIcon from "../icons/macros/CarbIcon";
import ProteinIcon from "../icons/macros/ProteinIcon";
import FatIcon from "../icons/macros/FatIcon";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { Doc } from "@/convex/_generated/dataModel";
import getColor from "@/lib/ui/getColor";
import { Link } from "expo-router";

interface LogItemProps {
  meal: Doc<"meals">;
}

function LogItem({ meal }: LogItemProps) {
  const macros = [
    {
      value: meal.totals?.carbs ?? 0,
      Icon: CarbIcon,
    },
    {
      value: meal.totals?.protein ?? 0,
      Icon: ProteinIcon,
    },
    {
      value: meal.totals?.fat ?? 0,
      Icon: FatIcon,
    },
  ];

  return (
    <Link
      href={{ pathname: "/app/meal", params: { mealId: meal._id } }}
      prefetch
      asChild
    >
      <Button variant="base" size="base">
        <Card style={styles.itemCard}>
          <View style={styles.itemHeaderContainer}>
            <Text
              size="16"
              weight="600"
              numberOfLines={1}
              style={styles.itemName}
            >
              {meal.name ?? "Comida sin nombre"}
            </Text>
            <Text size="14">{format(meal._creationTime, "HH:mm")}</Text>
          </View>
          <View style={styles.itemDetailsContainer}>
            <View
              key={`macro-calories`}
              style={[styles.itemMacroContainer, { marginRight: "auto" }]}
            >
              <View style={styles.itemMacroIcon}>
                <CalorieIcon size={16} strokeWidth={2.25} />
              </View>
              <Text size="14" weight="500">
                {meal.totals?.calories ?? 0}
              </Text>
            </View>
            {macros.map((macro, index) => (
              <View key={`macro-${index}`} style={styles.itemMacroContainer}>
                <View style={styles.itemMacroIcon}>
                  <macro.Icon size={16} strokeWidth={2.25} />
                </View>
                <Text size="14">{macro.value}</Text>
              </View>
            ))}
          </View>
        </Card>
      </Button>
    </Link>
  );
}

interface Props {
  meals: Doc<"meals">[];
}

export default function HomeRecentlyLogged({ meals }: Props) {
  return (
    <View style={styles.container}>
      <Text size="20" weight="600" style={styles.title}>
        Recientemente añadido
      </Text>
      <View style={styles.itemsContainer}>
        {meals.map((meal, index) => (
          <LogItem key={`log-item-${index}-${meal.name}`} meal={meal} />
        ))}
        {meals.length === 0 && (
          <Text
            size="14"
            color={getColor("mutedForeground", 0.5)}
            style={styles.noMealsAdded}
          >
            Añade comidas para verlas aquí...
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 32,
  },
  title: {
    paddingBottom: 16,
  },
  itemsContainer: {
    gap: 12,
  },
  noMealsAdded: {
    textAlign: "center",
    paddingTop: 16,
  },

  itemCard: {
    gap: 16,
  },
  itemHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemName: {
    flexShrink: 1,
    marginRight: 12,
  },
  itemDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  itemMacroContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  itemMacroIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
});
