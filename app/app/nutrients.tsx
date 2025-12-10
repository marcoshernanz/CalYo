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
import useScrollY from "@/lib/hooks/reanimated/useScrollY";
import getColor from "@/lib/ui/getColor";
import { StyleSheet, View } from "react-native";

const nutritionSections = [
  {
    id: "carbs",
    categoryLabel: "Carbohidratos y Azúcares",
    themeColor: getColor("carb"),
    metrics: [
      {
        label: "Hidratos Totales",
        dbKey: "carbohydrateByDifference",
        unit: "g",
      },
      {
        label: "Hidratos Netos",
        dbKey: null,
        isCalculated: true,
        unit: "g",
      },
      {
        label: "Fibra",
        dbKey: "fiberTotalDietary",
        unit: "g",
      },
      {
        label: "Azúcares Totales",
        dbKey: "sugarsTotal",
        unit: "g",
      },
    ],
  },
  {
    id: "fats",
    categoryLabel: "Grasas y Lípidos",
    themeColor: getColor("fat"),
    metrics: [
      { label: "Grasas Totales", dbKey: "totalLipidFat", unit: "g" },
      { label: "Saturadas", dbKey: "fattyAcidsTotalSaturated", unit: "g" },
      {
        label: "Monoinsaturadas",
        dbKey: "fattyAcidsTotalMonounsaturated",
        unit: "g",
      },
      {
        label: "Poliinsaturadas",
        dbKey: "fattyAcidsTotalPolyunsaturated",
        unit: "g",
      },
      { label: "Trans", dbKey: "fattyAcidsTotalTrans", unit: "g" },
      { label: "Colesterol", dbKey: "cholesterol", unit: "mg" },
    ],
  },
  {
    id: "protein",
    categoryLabel: "Proteínas",
    themeColor: getColor("protein"),
    metrics: [{ label: "Proteína Total", dbKey: "protein", unit: "g" }],
  },
  {
    id: "vitamins",
    categoryLabel: "Vitaminas",
    themeColor: getColor("purple"),
    metrics: [
      { label: "Vitamina A", dbKey: "vitaminARae", unit: "µg" },
      { label: "Vitamina B12", dbKey: "vitaminB12", unit: "µg" },
      { label: "Folato (B9)", dbKey: "folateDfe", unit: "µg" },
      { label: "Vitamina C", dbKey: "vitaminCTotalAscorbicAcid", unit: "mg" },
      {
        label: "Vitamina D",
        dbKey: "vitaminDD2D3InternationalUnits",
        unit: "IU",
      },
      { label: "Vitamina E", dbKey: "vitaminEAlphaTocopherol", unit: "mg" },
      { label: "Vitamina K", dbKey: "vitaminKPhylloquinone", unit: "µg" }, // Añadido
    ],
  },
  {
    id: "minerals",
    categoryLabel: "Minerales",
    themeColor: getColor("blue"),
    metrics: [
      { label: "Sodio", dbKey: "sodiumNa", unit: "mg" },
      { label: "Potasio", dbKey: "potassiumK", unit: "mg" },
      { label: "Magnesio", dbKey: "magnesiumMg", unit: "mg" },
      { label: "Calcio", dbKey: "calciumCa", unit: "mg" },
      { label: "Hierro", dbKey: "ironFe", unit: "mg" },
      { label: "Zinc", dbKey: "zincZn", unit: "mg" },
    ],
  },
  {
    id: "other",
    categoryLabel: "Otros",
    themeColor: getColor("foreground"),
    metrics: [
      { label: "Agua", dbKey: "water", unit: "g" },
      { label: "Cafeína", dbKey: "caffeine", unit: "mg" },
      { label: "Alcohol", dbKey: "alcoholEthyl", unit: "g" },
    ],
  },
];

export default function Nutrients() {
  const { scrollY, onScroll } = useScrollY();

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
                  <View
                    key={`summary-metric-${metric.label}`}
                    style={styles.metric}
                  >
                    <Text size="14" weight="500">
                      {metric.label}
                    </Text>
                    <View style={styles.progressContainer}>
                      <View style={styles.backgroundBar} />
                      <View
                        style={[
                          styles.overlayBar,
                          { backgroundColor: section.themeColor },
                        ]}
                      />
                      <View
                        style={[
                          styles.progressBar,
                          { backgroundColor: section.themeColor },
                        ]}
                      />
                    </View>
                  </View>
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
  },
  backgroundBar: {
    height: "100%",
    backgroundColor: getColor("secondary"),
    width: "65%",
  },
  overlayBar: {
    height: "100%",
    opacity: 0.25,
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
