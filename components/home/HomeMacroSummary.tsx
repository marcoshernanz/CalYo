import { type LucideProps } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import Text from "../ui/Text";
import getColor from "@/lib/ui/getColor";
import CircularProgress from "../ui/CircularProgress";
import {
  cancelAnimation,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useEffect, type ComponentType } from "react";
import FatIcon from "../icons/macros/FatIcon";
import CarbIcon from "../icons/macros/CarbIcon";
import ProteinIcon from "../icons/macros/ProteinIcon";
import CalorieIcon from "../icons/macros/CalorieIcon";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { profilesConfig } from "@/config/profilesConfig";
import calcRatio from "@/lib/utils/calcRatio";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import HomeSummaryCard from "./HomeSummaryCard";

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
  const progressCalories = useDerivedValue(
    () => calcRatio(totals.calories, targets.calories) * progress.value
  );

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
      <Button variant="base" size="base">
        <Card style={styles.caloriesCard}>
          <View style={styles.caloriesTextContainer}>
            <Text size="12" weight="600" color={getColor("mutedForeground")}>
              Calorías
            </Text>
            <View style={styles.caloriesValueContainer}>
              <Text size="40" weight="600">
                {totals.calories}
              </Text>
              <Text
                size="20"
                color={getColor("mutedForeground")}
                style={styles.caloriesTargetText}
              >
                {" "}
                / {targets.calories}
              </Text>
            </View>
          </View>
          <View style={styles.caloriesProgressContainer}>
            <CircularProgress
              progress={progressCalories}
              color={getColor("foreground")}
              strokeWidth={5}
              size={80}
            />
            <View style={styles.caloriesIconContainer}>
              <CalorieIcon size={20} strokeWidth={2.25} />
            </View>
          </View>
        </Card>
      </Button>
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
  caloriesCard: {
    backgroundColor: getColor("background"),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  caloriesTextContainer: {},
  caloriesValueContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  caloriesTargetText: {
    paddingBottom: 6,
  },
  caloriesProgressContainer: {
    height: 80,
    width: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  caloriesIconContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: getColor("muted"),
  },
  cardsContainer: {
    flexDirection: "row",
    gap: 8,
  },

  macroCard: {
    backgroundColor: getColor("background"),
    flex: 1,
    padding: 16,
  },
  macroCardValueContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingBottom: 12,
    paddingTop: 4,
  },
  macroCardTargetText: {
    paddingBottom: 3,
  },
  macroCardProgressContainer: {
    height: 80,
    width: 80,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
});
