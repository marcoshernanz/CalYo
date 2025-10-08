import { type LucideProps } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import Text from "../ui/Text";
import getColor from "@/lib/ui/getColor";
import CircularProgress from "../ui/CircularProgress";
import {
  cancelAnimation,
  SharedValue,
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

const calories = {
  value: 1532,
  target: 2000,
};

type Macro = {
  name: string;
  value: number;
  target: number;
  Icon: ComponentType<LucideProps>;
  color: string;
};

const macros: Macro[] = [
  {
    name: "Hidratos",
    value: 250,
    target: 300,
    Icon: CarbIcon,
    color: getColor("carb"),
  },
  {
    name: "Proteína",
    value: 150,
    target: 200,
    Icon: ProteinIcon,
    color: getColor("protein"),
  },
  {
    name: "Grasas",
    value: 70,
    target: 100,
    Icon: FatIcon,
    color: getColor("fat"),
  },
];

interface MacroCardProps {
  macro: Macro;
  progress: SharedValue<number>;
}

function MacroCard({ macro, progress }: MacroCardProps) {
  const progressMacro = useDerivedValue(
    () => progress.value * (macro.value / macro.target)
  );

  return (
    <Card style={styles.macroCard}>
      <Text size="12" weight="600" color={getColor("mutedForeground")}>
        {macro.name}
      </Text>
      <View style={styles.macroCardValueContainer}>
        <Text size="18" weight="600">
          {macro.value}
        </Text>
        <Text
          size="10"
          color={getColor("mutedForeground")}
          style={styles.macroCardTargetText}
        >
          {" "}
          / {macro.target}
        </Text>
      </View>
      <View style={styles.macroCardProgressContainer}>
        <CircularProgress
          progress={progressMacro}
          color={macro.color}
          strokeWidth={4}
        />
        <View style={styles.caloriesIconContainer}>
          <macro.Icon size={18} strokeWidth={2.25} />
        </View>
      </View>
    </Card>
  );
}

export default function HomeMacroSummary() {
  const progress = useSharedValue(0);
  const progressCalories = useDerivedValue(
    () => (calories.value / calories.target) * progress.value
  );

  useEffect(() => {
    progress.value = withTiming(1, { duration: 1500 });

    return () => {
      cancelAnimation(progress);
      progress.value = 0;
    };
  }, [progress]);

  return (
    <View style={styles.container}>
      <Card style={styles.caloriesCard}>
        <View style={styles.caloriesTextContainer}>
          <Text size="12" weight="600" color={getColor("mutedForeground")}>
            Calorías
          </Text>
          <View style={styles.caloriesValueContainer}>
            <Text size="40" weight="600">
              1532
            </Text>
            <Text
              size="20"
              color={getColor("mutedForeground")}
              style={styles.caloriesTargetText}
            >
              {" "}
              / 2000
            </Text>
          </View>
        </View>
        <View style={styles.caloriesProgressContainer}>
          <CircularProgress
            progress={progressCalories}
            color={getColor("foreground")}
            strokeWidth={5}
          />
          <View style={styles.caloriesIconContainer}>
            <CalorieIcon size={20} strokeWidth={2.25} />
          </View>
        </View>
      </Card>
      <View style={styles.cardsContainer}>
        {macros.map((macro) => (
          <MacroCard
            key={`macro-${macro.name}`}
            macro={macro}
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
  },
  macroCardIconContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: getColor("muted"),
  },
});
