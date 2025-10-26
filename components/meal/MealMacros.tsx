import { StyleSheet, View } from "react-native";
import Card from "../ui/Card";
import getColor from "@/lib/ui/getColor";
import { FlameIcon } from "lucide-react-native";
import Text from "../ui/Text";
import { useMemo } from "react";
import CarbIcon from "../icons/macros/CarbIcon";
import ProteinIcon from "../icons/macros/ProteinIcon";
import FatIcon from "../icons/macros/FatIcon";
import Button from "../ui/Button";

interface Props {
  totals: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
}

export default function MealMacros({ totals }: Props) {
  const macros = useMemo(
    () => [
      {
        label: "Hidratos",
        value: totals.carbs,
        color: getColor("carb"),
        Icon: CarbIcon,
      },
      {
        label: "Proteína",
        value: totals.protein,
        color: getColor("protein"),
        Icon: ProteinIcon,
      },
      {
        label: "Grasas",
        value: totals.fat,
        color: getColor("fat"),
        Icon: FatIcon,
      },
    ],
    [totals.carbs, totals.protein, totals.fat]
  );

  return (
    <View style={styles.container}>
      <Button asChild>
        <Card style={styles.caloriesCard}>
          <View style={styles.caloriesIconContainer}>
            <FlameIcon />
          </View>
          <View style={styles.caloriesTextContainer}>
            <Text size="12" color={getColor("mutedForeground")}>
              Calorías
            </Text>
            <Text size="24" weight="700">
              {totals.calories} kcal
            </Text>
          </View>
        </Card>
      </Button>
      <View style={styles.macrosContainer}>
        {macros.map((macro, index) => (
          <Button key={`macro-${macro.label}-${index}`} asChild>
            <Card
              key={`macro-${macro.label}-${index}`}
              style={styles.macroCard}
            >
              <Text size="12" color={getColor("mutedForeground")}>
                {macro.label}
              </Text>
              <View style={styles.macroValueContainer}>
                <View style={styles.macroIconContainer}>
                  <macro.Icon size={14} color={macro.color} />
                </View>
                <Text size="16" weight="600">
                  {macro.value} g
                </Text>
              </View>
            </Card>
          </Button>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
    paddingBottom: 32,
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
