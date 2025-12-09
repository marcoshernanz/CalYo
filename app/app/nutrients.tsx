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
    summaryMetrics: [
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
    detailedMetrics: [
      {
        groupLabel: "Desglose de Fibra",
        items: [
          { label: "Soluble", dbKey: "fiberSoluble", unit: "g" },
          { label: "Insoluble", dbKey: "fiberInsoluble", unit: "g" },
        ],
      },
      {
        groupLabel: "Tipos de Azúcar",
        items: [
          { label: "Sacarosa", dbKey: "sucrose", unit: "g" },
          { label: "Glucosa", dbKey: "glucose", unit: "g" },
          { label: "Fructosa", dbKey: "fructose", unit: "g" },
          { label: "Lactosa", dbKey: "lactose", unit: "g" },
          { label: "Maltosa", dbKey: "maltose", unit: "g" },
        ],
      },
      {
        groupLabel: "Otros",
        items: [{ label: "Almidón", dbKey: "starch", unit: "g" }],
      },
    ],
  },
  {
    id: "fats",
    categoryLabel: "Grasas y Lípidos",
    themeColor: getColor("fat"),
    summaryMetrics: [
      { label: "Grasas Totales", dbKey: "totalLipidFat", unit: "g" },
      { label: "Saturadas", dbKey: "fattyAcidsTotalSaturated", unit: "g" },
      { label: "Trans", dbKey: "fattyAcidsTotalTrans", unit: "g" },
      { label: "Colesterol", dbKey: "cholesterol", unit: "mg" },
    ],
    detailedMetrics: [
      {
        groupLabel: "Grasas Saludables",
        items: [
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
        ],
      },
      {
        groupLabel: "Ácidos Grasos Omega",
        items: [
          { label: "Omega-3 (DHA)", dbKey: "pufa226N3Dha", unit: "g" },
          { label: "Omega-3 (EPA)", dbKey: "pufa205N3Epa", unit: "g" },
          { label: "Omega-6", dbKey: "pufa182N6CC", unit: "g" },
        ],
      },
      {
        groupLabel: "Esteroles",
        items: [{ label: "Fitosteroles", dbKey: "phytosterols", unit: "mg" }],
      },
    ],
  },
  {
    id: "protein",
    categoryLabel: "Proteínas y Aminoácidos",
    themeColor: getColor("protein"),
    summaryMetrics: [{ label: "Proteína Total", dbKey: "protein", unit: "g" }],
    detailedMetrics: [
      {
        groupLabel: "Aminoácidos Ramificados",
        items: [
          { label: "Leucina", dbKey: "leucine", unit: "g" },
          { label: "Isoleucina", dbKey: "isoleucine", unit: "g" },
          { label: "Valina", dbKey: "valine", unit: "g" },
        ],
      },
      {
        groupLabel: "Esenciales y Bienestar",
        items: [
          { label: "Triptófano", dbKey: "tryptophan", unit: "g" },
          { label: "Lisina", dbKey: "lysine", unit: "g" },
          { label: "Metionina", dbKey: "methionine", unit: "g" },
          { label: "Histidina", dbKey: "histidine", unit: "g" },
        ],
      },
    ],
  },
  {
    id: "vitamins",
    categoryLabel: "Vitaminas",
    themeColor: getColor("purple"),
    summaryMetrics: [
      { label: "Vitamina A", dbKey: "vitaminARae", unit: "µg" },
      { label: "Vitamina B", dbKey: "vitaminB", unit: "mg" },
      { label: "Vitamina C", dbKey: "vitaminCTotalAscorbicAcid", unit: "mg" },
      {
        label: "Vitamina D",
        dbKey: "vitaminDD2D3InternationalUnits",
        unit: "IU",
      },
      { label: "Vitamina E", dbKey: "vitaminEAlphaTocopherol", unit: "mg" },
    ],
    detailedMetrics: [
      {
        groupLabel: "Complejo B",
        items: [
          { label: "B1 (Tiamina)", dbKey: "thiamin", unit: "mg" },
          { label: "B2 (Riboflavina)", dbKey: "riboflavin", unit: "mg" },
          { label: "B3 (Niacina)", dbKey: "niacin", unit: "mg" },
          {
            label: "B5 (Á. Pantoténico)",
            dbKey: "pantothenicAcid",
            unit: "mg",
          },
          { label: "B6", dbKey: "vitaminB6", unit: "mg" },
          { label: "B9 (Folato)", dbKey: "folateDfe", unit: "µg" },
          { label: "B12", dbKey: "vitaminB12", unit: "µg" },
        ],
      },
      {
        groupLabel: "Otras",
        items: [
          { label: "Vitamina K", dbKey: "vitaminKPhylloquinone", unit: "µg" },
          { label: "Colina", dbKey: "cholineTotal", unit: "mg" },
        ],
      },
    ],
  },
  {
    id: "minerals",
    categoryLabel: "Minerales",
    themeColor: getColor("blue"),
    summaryMetrics: [
      { label: "Sodio", dbKey: "sodiumNa", unit: "mg" },
      { label: "Potasio", dbKey: "potassiumK", unit: "mg" },
      { label: "Magnesio", dbKey: "magnesiumMg", unit: "mg" },
      { label: "Calcio", dbKey: "calciumCa", unit: "mg" },
    ],
    detailedMetrics: [
      {
        groupLabel: "Oligoelementos",
        items: [
          { label: "Hierro", dbKey: "ironFe", unit: "mg" },
          { label: "Zinc", dbKey: "zincZn", unit: "mg" },
          { label: "Fósforo", dbKey: "phosphorusP", unit: "mg" },
          { label: "Yodo", dbKey: "iodineI", unit: "µg" },
          { label: "Selenio", dbKey: "seleniumSe", unit: "µg" },
          { label: "Cobre", dbKey: "copperCu", unit: "mg" },
        ],
      },
    ],
  },
  {
    id: "other",
    categoryLabel: "Otros Componentes",
    themeColor: getColor("foreground"), // TODO: Define color
    summaryMetrics: [
      { label: "Agua", dbKey: "water", unit: "g" },
      { label: "Cafeína", dbKey: "caffeine", unit: "mg" },
      { label: "Alcohol", dbKey: "alcoholEthyl", unit: "g" },
    ],
    detailedMetrics: [], // Vacío intencionalmente si no hay más desglose
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
                {section.summaryMetrics.map((metric) => (
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
                        backgroundColor: getColor("secondary"),
                        justifyContent: "center",
                      }}
                    >
                      <View
                        style={{
                          height: 8,
                          backgroundColor: section.themeColor,
                          width: "50%",
                        }}
                      ></View>
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
