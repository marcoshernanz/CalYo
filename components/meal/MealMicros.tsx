import { StyleSheet, View } from "react-native";
import getColor from "@/lib/ui/getColor";
import MealSummaryCard from "./MealSummaryCard";
import MealSummaryCardBig from "./MealSummaryCardBig";
import FiberIcon from "../icons/micros/FiberIcon";
import SugarIcon from "../icons/micros/SugarIcon";
import SodiumIcon from "../icons/micros/SodiumIcon";
import HealthIcon from "../icons/micros/HealthIcon";
import { Link } from "expo-router";
import { MicrosType } from "@/convex/tables/mealItems";
import { Id } from "@/convex/_generated/dataModel";

type SourceType =
  | { source: "meal"; id?: Id<"meals"> }
  | { source: "mealItem"; id?: Id<"mealItems"> };

type Props = {
  loading: boolean;
  micros?: MicrosType;
} & SourceType;

export default function MealMicros({ source, id, loading, micros }: Props) {
  const displayMicros = [
    {
      label: "Fibra",
      color: getColor("fiber"),
      Icon: FiberIcon,
      value: Math.round(micros?.fiber ?? 0),
      unit: "g",
    },
    {
      label: "Azúcar",
      color: getColor("sugar"),
      Icon: SugarIcon,
      value: Math.round(micros?.sugar ?? 0),
      unit: "g",
    },
    {
      label: "Sodio",
      color: getColor("sodium"),
      Icon: SodiumIcon,
      value: Math.round(micros?.sodium ?? 0),
      unit: "g",
    },
  ];

  return (
    <View style={styles.container}>
      <Link
        href={
          source === "meal"
            ? {
                pathname: "/app/(meal)/mealNutrients",
                params: { mealId: id },
              }
            : {
                pathname: "/app/(mealItem)/mealItemNutrients",
                params: { mealItemId: id },
              }
        }
        asChild
      >
        <MealSummaryCardBig
          item={{
            label: "Calidad",
            Icon: HealthIcon,
            color: getColor("health"),
            value: Math.round(micros?.score ?? 0),
            unit: "",
          }}
          loading={loading}
        />
      </Link>
      <View style={styles.macrosContainer}>
        {displayMicros.map((macro, index) => (
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
