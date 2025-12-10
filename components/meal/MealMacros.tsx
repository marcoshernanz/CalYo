import { StyleSheet, View } from "react-native";
import getColor from "@/lib/ui/getColor";
import { FlameIcon } from "lucide-react-native";
import CarbIcon from "../icons/macros/CarbIcon";
import ProteinIcon from "../icons/macros/ProteinIcon";
import FatIcon from "../icons/macros/FatIcon";
import { Doc } from "@/convex/_generated/dataModel";
import MealSummaryCard from "./MealSummaryCard";
import MealSummaryCardBig from "./MealSummaryCardBig";

type Props = {
  loading: boolean;
  macros?: Doc<"meals">["totalMacros"];
};

export default function MealMacros({ loading, macros }: Props) {
  const displayMacros = [
    {
      label: "Hidratos",
      color: getColor("carb"),
      Icon: CarbIcon,
      value: Math.round(macros?.carbs ?? 0),
      unit: "g",
    },
    {
      label: "Proteína",
      color: getColor("protein"),
      Icon: ProteinIcon,
      value: Math.round(macros?.protein ?? 0),
      unit: "g",
    },
    {
      label: "Grasas",
      color: getColor("fat"),
      Icon: FatIcon,
      value: Math.round(macros?.fat ?? 0),
      unit: "g",
    },
  ];

  return (
    <View style={styles.container}>
      <MealSummaryCardBig
        item={{
          label: "Calorías",
          Icon: FlameIcon,
          color: getColor("foreground"),
          value: Math.round(macros?.calories ?? 0),
          unit: "kcal",
        }}
        loading={loading}
      />
      <View style={styles.macrosContainer}>
        {displayMacros.map((macro, index) => (
          <MealSummaryCard
            key={`macro-${macro.label}-${index}`}
            macro={macro}
            loading={loading}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 6,
    paddingHorizontal: 16,
    // paddingBottom: 32,
  },
  macrosContainer: {
    flexDirection: "row",
    gap: 6,
  },
});
