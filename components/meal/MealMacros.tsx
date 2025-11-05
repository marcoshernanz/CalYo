import WithSkeleton from "../ui/WithSkeleton";
import { StyleSheet, View } from "react-native";
import Card from "../ui/Card";
import getColor from "@/lib/ui/getColor";
import { FlameIcon } from "lucide-react-native";
import Text from "../ui/Text";
import CarbIcon from "../icons/macros/CarbIcon";
import ProteinIcon from "../icons/macros/ProteinIcon";
import FatIcon from "../icons/macros/FatIcon";
import Button from "../ui/Button";

type Props = {
  loading: boolean;
  totals?: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
}

export default function MealMacros({ loading, totals }: Props) {
  const displayMacros = [
    {
      label: "Hidratos",
      color: getColor("carb"),
      Icon: CarbIcon,
      value: totals?.carbs ?? 0,
    },
    {
      label: "Proteína",
      color: getColor("protein"),
      Icon: ProteinIcon,
      value: totals?.protein ?? 0,
    },
    {
      label: "Grasas",
      color: getColor("fat"),
      Icon: FatIcon,
      value: totals?.fat ?? 0,
    },
  ];

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
            <WithSkeleton
              loading={loading}
              skeletonStyle={{ height: 24, width: 100, borderRadius: 6 }}
            >
              <Text size="24" weight="700">
                {totals?.calories} kcal
              </Text>
            </WithSkeleton>
          </View>
        </Card>
      </Button>

      <View style={styles.macrosContainer}>
        {displayMacros.map((macro, index) => (
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
                <WithSkeleton
                  loading={loading}
                  skeletonStyle={{ height: 16, width: 40, borderRadius: 4 }}
                >
                  <Text size="16" weight="600">
                    {macro.value} g
                  </Text>
                </WithSkeleton>
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
