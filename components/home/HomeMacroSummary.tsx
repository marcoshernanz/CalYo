import { type LucideProps } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import getColor from "@/lib/ui/getColor";
import {
  cancelAnimation,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useEffect, type ComponentType } from "react";
import FatIcon from "../icons/macros/FatIcon";
import CarbIcon from "../icons/macros/CarbIcon";
import ProteinIcon from "../icons/macros/ProteinIcon";
import CalorieIcon from "../icons/macros/CalorieIcon";
import { profilesConfig } from "@/config/profilesConfig";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import HomeSummaryCard from "./HomeSummaryCard";
import HomeSummaryCardBig from "./HomeSummaryCardBig";

type Macro = {
  name: string;
  value: number;
  target: number;
  Icon: ComponentType<LucideProps>;
  color: string;
};

type Props = {
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
};

export default function HomeMacroSummary({ totals }: Props) {
  const targets =
    useQuery(api.profiles.getProfile.default)?.targets ??
    profilesConfig.defaultValues.targets;

  const progress = useSharedValue(0);

  const macros: Macro[] = [
    {
      name: "Hidratos",
      value: totals.carbs,
      target: targets.carbs,
      Icon: CarbIcon,
      color: getColor("carb"),
    },
    {
      name: "Proteína",
      value: totals.protein,
      target: targets.protein,
      Icon: ProteinIcon,
      color: getColor("protein"),
    },
    {
      name: "Grasas",
      value: totals.fat,
      target: targets.fat,
      Icon: FatIcon,
      color: getColor("fat"),
    },
  ];

  useEffect(() => {
    progress.value = withTiming(1, { duration: 1500 });

    return () => {
      cancelAnimation(progress);
      progress.value = 0;
    };
  }, [progress]);

  return (
    <View style={styles.container}>
      <HomeSummaryCardBig
        item={{
          name: "Calorías",
          value: totals.calories,
          target: targets.calories,
          Icon: CalorieIcon,
          color: getColor("foreground"),
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
