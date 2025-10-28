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
import Skeleton from "../ui/Skeleton";

interface Props {
  loading: boolean;
  totals?: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
}

export default function MealMacros({ loading, totals }: Props) {
  const macros = useMemo(
    () =>
      totals
        ? [
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
          ]
        : [],
    [totals]
  );

  if (loading || !totals) {
    return (
      <View style={styles.container}>
        <Card style={styles.caloriesCard}>
          <View style={styles.caloriesIconContainer}>
            <Skeleton style={{ height: 28, width: 28, borderRadius: 8 }} />
          </View>
          <View style={styles.caloriesTextContainer}>
            <Skeleton style={{ height: 12, width: 60, marginBottom: 6 }} />
            <Skeleton style={{ height: 24, width: 120 }} />
          </View>
        </Card>
        <View style={styles.macrosContainer}>
          {[0, 1, 2].map((i) => (
            <Card
              key={`macro-skeleton-${i}`}
              style={[styles.macroCard, styles.macroCardSkeleton]}
            >
              <Skeleton style={{ height: 12, width: 70, marginBottom: 8 }} />
              <View style={styles.macroValueContainer}>
                <Skeleton style={{ height: 22, width: 22, borderRadius: 16 }} />
                <Skeleton style={{ height: 16, width: 50 }} />
              </View>
            </Card>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button variant="base" size="base">
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
          <Button
            key={`macro-${macro.label}-${index}`}
            variant="base"
            size="base"
            style={styles.macroCardButton}
          >
            <Card style={styles.macroCard}>
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
  macroCardButton: {
    flex: 1,
  },
  macroCard: {
    flex: 1,
    padding: 12,
    gap: 8,
  },
  macroCardSkeleton: {
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
