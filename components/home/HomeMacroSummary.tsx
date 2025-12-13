import { type LucideProps } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import getColor from "@/lib/ui/getColor";
import { type ComponentType } from "react";
import FatIcon from "../icons/macros/FatIcon";
import CarbIcon from "../icons/macros/CarbIcon";
import ProteinIcon from "../icons/macros/ProteinIcon";
import CalorieIcon from "../icons/macros/CalorieIcon";
import { profilesConfig } from "@/config/profilesConfig";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import HomeSummaryCard from "./HomeSummaryCard";
import HomeSummaryCardBig from "./HomeSummaryCardBig";
import { MacrosType } from "@/convex/tables/mealItems";
import useProgress from "@/lib/hooks/reanimated/useProgress";

type Macro = {
  name: string;
  value: number;
  target: number;
  Icon: ComponentType<LucideProps>;
  color: string;
};

type Props = {
  totalMacros: MacrosType;
};

export default function HomeMacroSummary({ totalMacros }: Props) {
  const targets =
    useQuery(api.profiles.getProfile.default)?.targets ??
    profilesConfig.defaultValues.targets;

  const progress = useProgress();

  const macros: Macro[] = [
    {
      name: "Hidratos",
      value: totalMacros.carbs,
      target: targets.carbs,
      Icon: CarbIcon,
      color: getColor("carb"),
    },
    {
      name: "Proteína",
      value: totalMacros.protein,
      target: targets.protein,
      Icon: ProteinIcon,
      color: getColor("protein"),
    },
    {
      name: "Grasas",
      value: totalMacros.fat,
      target: targets.fat,
      Icon: FatIcon,
      color: getColor("fat"),
    },
  ];

  return (
    <View style={styles.container}>
      <HomeSummaryCardBig
        item={{
          name: "Calorías",
          value: totalMacros.calories,
          target: targets.calories,
          Icon: CalorieIcon,
          color: getColor("calorie"),
        }}
        progress={progress}
      />
      <View style={styles.cardsContainer}>
        {macros.map((macro) => (
          <HomeSummaryCard
            key={`macro-summary-${macro.name}`}
            item={macro}
            progress={progress}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    flex: 1,
    paddingHorizontal: 16,
  },
  cardsContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
