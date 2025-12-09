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
import { View } from "react-native";

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
      }, // Añadido
      {
        label: "Poliinsaturadas",
        dbKey: "fattyAcidsTotalPolyunsaturated",
        unit: "g",
      }, // Añadido
      { label: "Trans", dbKey: "fattyAcidsTotalTrans", unit: "g" },
      { label: "Colesterol", dbKey: "cholesterol", unit: "mg" },
    ],
  },
  {
    id: "protein",
    categoryLabel: "Proteínas",
    themeColor: getColor("protein"),
    metrics: [
      { label: "Proteína Total", dbKey: "protein", unit: "g" },
      // Nota: He decidido no poner aminoácidos (Leucina, etc.)
      // para mantener el diseño limpio como pediste.
    ],
  },
  {
    id: "vitamins",
    categoryLabel: "Vitaminas",
    themeColor: getColor("purple"),
    metrics: [
      { label: "Vitamina A", dbKey: "vitaminARae", unit: "µg" },
      { label: "Vitamina B12", dbKey: "vitaminB12", unit: "µg" }, // Crucial
      { label: "Folato (B9)", dbKey: "folateDfe", unit: "µg" }, // Crucial
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
      { label: "Hierro", dbKey: "ironFe", unit: "mg" }, // Añadido (Muy importante)
      { label: "Zinc", dbKey: "zincZn", unit: "mg" }, // Añadido
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
        <View style={{ gap: 24 }}>
          {nutritionSections.map((section) => (
            <View
              key={`micro-${section.id}-${section.categoryLabel}`}
              style={{ gap: 8 }}
            >
              <Text size="18" weight="600">
                {section.categoryLabel}
              </Text>
              <View style={{ gap: 12 }}>
                {section.metrics.map((metric) => (
                  <View
                    key={`summary-metric-${metric.label}`}
                    style={{ gap: 4 }}
                  >
                    <Text size="14" weight="500">
                      {metric.label}
                    </Text>
                    <View
                      style={{
                        height: 16,
                        justifyContent: "center",
                      }}
                    >
                      <View
                        style={{
                          height: "100%",
                          backgroundColor: getColor("secondary"),
                          width: "65%",
                        }}
                      />
                      <View
                        style={{
                          height: "100%",
                          backgroundColor: section.themeColor,
                          opacity: 0.25,
                          width: "35%",
                          right: 0,
                          position: "absolute",
                        }}
                      />
                      <View
                        style={{
                          height: 6,
                          backgroundColor: section.themeColor,
                          width: "75%",
                          position: "absolute",
                        }}
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
