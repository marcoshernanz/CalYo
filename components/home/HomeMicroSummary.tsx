import { StyleSheet, View } from "react-native";
import {
  cancelAnimation,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useEffect, type ComponentType } from "react";
import {
  HeartPulse,
  Wheat,
  Waves,
  Candy,
  type LucideProps,
} from "lucide-react-native";
import getColor from "@/lib/ui/getColor";
import HomeSummaryCard from "./HomeSummaryCard";
import HomeSummaryCardBig from "./HomeSummaryCardBig";

type Micro = {
  name: string;
  value: number;
  target: number;
  Icon: ComponentType<LucideProps>;
  color: string;
};

type Props = {
  totals: {
    score: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
};

export default function HomeMicroSummary({ totals }: Props) {
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
      value: totals.fiber,
      target: targets.fiber,
      Icon: Wheat,
      color: "#8B5CF6",
    },
    {
      name: "Azúcar",
      value: totals.sugar,
      target: targets.sugar,
      Icon: Candy,
      color: "#F43F5E",
    },
    {
      name: "Sodio",
      value: totals.sodium,
      target: targets.sodium,
      Icon: Waves,
      color: "#06B6D4",
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
          name: "Calidad",
          value: totals.score,
          target: targets.score,
          Icon: HeartPulse,
          color: getColor("primary"),
        }}
        progress={progress}
      />
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
