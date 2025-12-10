import {
  ScreenHeader,
  ScreenHeaderBackButton,
  ScreenHeaderTitle,
} from "@/components/ui/screen/ScreenHeader";
import {
  ScreenMain,
  ScreenMainScrollView,
} from "@/components/ui/screen/ScreenMain";
import Text from "@/components/ui/Text";
import { NutrientsType } from "@/convex/tables/mealItems";
import useScrollY from "@/lib/hooks/reanimated/useScrollY";
import getColor from "@/lib/ui/getColor";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type MetricType = {
  id: string | null;
  label: string;
  unit: string;
};

type NutritionSection = {
  id: string;
  categoryLabel: string;
  themeColor: string;
  metrics: MetricType[];
};

const nutritionSections: NutritionSection[] = [
  {
    id: "carbs",
    categoryLabel: "Carbohidratos y Azúcares",
    themeColor: getColor("carb"),
    metrics: [
      { id: "total", label: "Hidratos Totales", unit: "g" },
      { id: "net", label: "Hidratos Netos", unit: "g" },
      { id: "fiber", label: "Fibra", unit: "g" },
      { id: "sugar", label: "Azúcares Totales", unit: "g" },
    ],
  },
  {
    id: "fats",
    categoryLabel: "Grasas y Lípidos",
    themeColor: getColor("fat"),
    metrics: [
      { id: "total", label: "Grasas Totales", unit: "g" },
      { id: "saturated", label: "Saturadas", unit: "g" },
      { id: "monounsaturated", label: "Monoinsaturadas", unit: "g" },
      { id: "polyunsaturated", label: "Poliinsaturadas", unit: "g" },
      { id: "trans", label: "Trans", unit: "g" },
      { id: "cholesterol", label: "Colesterol", unit: "mg" },
    ],
  },
  {
    id: "protein",
    categoryLabel: "Proteínas",
    themeColor: getColor("protein"),
    metrics: [
      { id: "total", label: "Proteína Total", unit: "g" },
      { id: "leucine", label: "Leucina", unit: "g" },
      { id: "isoleucine", label: "Isoleucina", unit: "g" },
      { id: "valine", label: "Valina", unit: "g" },
      { id: "tryptophan", label: "Triptófano", unit: "g" },
    ],
  },
  {
    id: "vitamins",
    categoryLabel: "Vitaminas",
    themeColor: getColor("purple"),
    metrics: [
      { id: "a", label: "Vitamina A", unit: "µg" },
      { id: "b12", label: "Vitamina B12", unit: "µg" },
      { id: "b9", label: "Folato (B9)", unit: "µg" },
      { id: "c", label: "Vitamina C", unit: "mg" },
      { id: "d", label: "Vitamina D", unit: "IU" },
      { id: "e", label: "Vitamina E", unit: "mg" },
      { id: "k", label: "Vitamina K", unit: "µg" },
    ],
  },
  {
    id: "minerals",
    categoryLabel: "Minerales",
    themeColor: getColor("blue"),
    metrics: [
      { id: "sodium", label: "Sodio", unit: "mg" },
      { id: "potassium", label: "Potasio", unit: "mg" },
      { id: "magnesium", label: "Magnesio", unit: "mg" },
      { id: "calcium", label: "Calcio", unit: "mg" },
      { id: "iron", label: "Hierro", unit: "mg" },
      { id: "zinc", label: "Zinc", unit: "mg" },
    ],
  },
  {
    id: "other",
    categoryLabel: "Otros",
    themeColor: getColor("foreground"),
    metrics: [
      { id: "water", label: "Agua", unit: "g" },
      { id: "caffeine", label: "Cafeína", unit: "mg" },
      { id: "alcohol", label: "Alcohol", unit: "g" },
    ],
  },
];

type MetricProps = {
  metric: MetricType;
  themeColor: string;
  progress: SharedValue<number>;
};

function Metric({ metric, themeColor, progress }: MetricProps) {
  const value = 60; // TODO
  const max = 100; // TODO
  const target = [50, 80]; // TODO

  const valuePercent = (value / max) * 100;
  const targetPercent = [(target[0] / max) * 100, (target[1] / max) * 100];

  const animatedStyles = {
    progressBar: useAnimatedStyle(() => ({
      width: `${valuePercent * progress.value}%`,
    })),
  };

  return (
    <View style={styles.metric}>
      <Text size="14" weight="500">
        {metric.label}
      </Text>
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.overlayBar,
            {
              backgroundColor: themeColor,
              left: `${targetPercent[0]}%`,
              right: `${100 - targetPercent[1]}%`,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.progressBar,
            {
              backgroundColor: themeColor,
              width: `${valuePercent}%`,
            },
            animatedStyles.progressBar,
          ]}
        />
      </View>
    </View>
  );
}

type Props = {
  nutrients?: NutrientsType;
};

export default function Nutrients({ nutrients }: Props) {
  const { scrollY, onScroll } = useScrollY();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 1500 });

    return () => {
      cancelAnimation(progress);
      progress.value = 0;
    };
  }, [progress]);

  return (
    <ScreenMain edges={[]}>
      <ScreenHeader scrollY={scrollY}>
        <ScreenHeaderBackButton />
        <ScreenHeaderTitle title="Micronutrientes" />
      </ScreenHeader>

      <ScreenMainScrollView
        scrollViewProps={{ onScroll, contentContainerStyle: { flexGrow: 1 } }}
        safeAreaProps={{ edges: ["left", "right", "bottom"] }}
      >
        <View style={styles.container}>
          {nutritionSections.map((section) => (
            <View
              key={`micro-${section.id}-${section.categoryLabel}`}
              style={styles.section}
            >
              <Text size="18" weight="600">
                {section.categoryLabel}
              </Text>
              <View style={styles.metricsContainer}>
                {section.metrics.map((metric) => (
                  <Metric
                    key={`summary-metric-${metric.label}`}
                    metric={metric}
                    themeColor={section.themeColor}
                    progress={progress}
                  />
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScreenMainScrollView>
    </ScreenMain>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  section: {
    gap: 8,
  },
  metricsContainer: {
    gap: 12,
  },
  metric: {
    gap: 4,
  },
  progressContainer: {
    height: 16,
    justifyContent: "center",
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: getColor("secondary"),
  },
  overlayBar: {
    height: "100%",
    opacity: 0.3,
    width: "35%",
    right: 0,
    position: "absolute",
  },
  progressBar: {
    height: 6,
    width: "75%",
    position: "absolute",
    borderRadius: 999,
  },
});
