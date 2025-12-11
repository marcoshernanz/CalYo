import { StyleSheet, View } from "react-native";
import {
  cancelAnimation,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useEffect, type ComponentType } from "react";
import { type LucideProps } from "lucide-react-native";
import getColor from "@/lib/ui/getColor";
import HomeSummaryCard from "./HomeSummaryCard";
import HomeSummaryCardBig from "./HomeSummaryCardBig";
import FiberIcon from "../icons/micros/FiberIcon";
import SugarIcon from "../icons/micros/SugarIcon";
import SodiumIcon from "../icons/micros/SodiumIcon";
import HealthIcon from "../icons/micros/HealthIcon";
import { Link } from "expo-router";
import { MicrosType, NutrientsType } from "@/convex/tables/mealItems";

type Micro = {
  name: string;
  value: number;
  target: number;
  Icon: ComponentType<LucideProps>;
  color: string;
};

type Props = {
  totalMicros: MicrosType;
  totalNutrients: NutrientsType;
  dayIndex: number;
};

export default function HomeMicroSummary({
  totalMicros,
  totalNutrients,
  dayIndex,
}: Props) {
  // TODO
  const targets = {
    score: 100,
    fiber: 30,
    sugar: 50,
    sodium: 2300,
  };

  const progress = useSharedValue(0);

  const micros: Micro[] = [
    {
      name: "Fibra",
      value: totalMicros.fiber,
      target: targets.fiber,
      Icon: FiberIcon,
      color: getColor("fiber"),
    },
    {
      name: "Azúcar",
      value: totalMicros.sugar,
      target: targets.sugar,
      Icon: SugarIcon,
      color: getColor("sugar"),
    },
    {
      name: "Sodio",
      value: totalMicros.sodium * 1000,
      target: targets.sodium,
      Icon: SodiumIcon,
      color: getColor("sodium"),
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
      <Link
        href={{ pathname: "/app/(home)/nutrients", params: { dayIndex } }}
        asChild
      >
        <HomeSummaryCardBig
          item={{
            name: "Calidad",
            value: totalMicros.score,
            target: targets.score,
            Icon: HealthIcon,
            color: getColor("health"),
          }}
          progress={progress}
        />
      </Link>
      <View style={styles.cardsContainer}>
        {micros.map((nutrient) => (
          <HomeSummaryCard
            key={`micro-summary-${nutrient.name}`}
            item={nutrient}
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
