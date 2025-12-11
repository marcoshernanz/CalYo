import { NutrientsType } from "@/convex/tables/mealItems";
import getColor from "@/lib/ui/getColor";

export type NutrientMetric = {
  id: string;
  label: string;
  unit: string;
  value: number;
  default: number;
  target: [number, number];
  max: number;
};

type NutrientCategory = {
  id: keyof NutrientsType;
  categoryLabel: string;
  themeColor: string;
  metrics: NutrientMetric[];
};

type NutrientsData = NutrientCategory[];

export const nutrientsData: NutrientsData = [
  {
    id: "carbs",
    categoryLabel: "Carbohidratos y Azúcares",
    themeColor: getColor("carb"),
    metrics: [
      {
        id: "total",
        label: "Hidratos Totales",
        unit: "g",
        value: 10,
        default: 0,
        target: [45, 65],
        max: 300,
      },
      {
        id: "net",
        label: "Hidratos Netos",
        unit: "g",
        value: 10,
        default: 0,
        target: [45, 65],
        max: 300,
      },
      {
        id: "fiber",
        label: "Fibra",
        unit: "g",
        value: 10,
        default: 0,
        target: [45, 65],
        max: 300,
      },
      {
        id: "sugar",
        label: "Azúcares Totales",
        unit: "g",
        value: 10,
        default: 0,
        target: [45, 65],
        max: 300,
      },
    ],
  },
  {
    id: "fats",
    categoryLabel: "Grasas y Lípidos",
    themeColor: getColor("fat"),
    metrics: [
      {
        id: "total",
        label: "Grasas Totales",
        unit: "g",
        value: 10,
        default: 0,
        target: [45, 65],
        max: 300,
      },
      {
        id: "saturated",
        label: "Saturadas",
        unit: "g",
        value: 10,
        default: 0,
        target: [45, 65],
        max: 300,
      },
      {
        id: "monounsaturated",
        label: "Monoinsaturadas",
        unit: "g",
        value: 10,
        default: 0,
        target: [45, 65],
        max: 300,
      },
      {
        id: "polyunsaturated",
        label: "Poliinsaturadas",
        unit: "g",
        value: 10,
        default: 0,
        target: [45, 65],
        max: 300,
      },
      {
        id: "trans",
        label: "Trans",
        unit: "g",
        value: 10,
        default: 0,
        target: [45, 65],
        max: 300,
      },
      {
        id: "cholesterol",
        label: "Colesterol",
        unit: "mg",
        value: 10,
        default: 0,
        target: [45, 65],
        max: 300,
      },
    ],
  },
  {
    id: "protein",
    categoryLabel: "Proteínas",
    themeColor: getColor("protein"),
    metrics: [
      {
        id: "total",
        label: "Proteína Total",
        unit: "g",
        value: 10,
        default: 0,
        target: [45, 65],
        max: 300,
      },
      {
        id: "leucine",
        label: "Leucina",
        unit: "g",
        value: 10,
        default: 0,
        target: [45, 65],
        max: 300,
      },
      {
        id: "isoleucine",
        label: "Isoleucina",
        unit: "g",
        value: 10,
        default: 0,
        target: [45, 65],
        max: 300,
      },
      {
        id: "valine",
        label: "Valina",
        unit: "g",
        value: 10,
        default: 0,
        target: [45, 65],
        max: 300,
      },
      {
        id: "tryptophan",
        label: "Triptófano",
        unit: "g",
        value: 10,
        default: 0,
        target: [45, 65],
        max: 300,
      },
    ],
  },
  {
    id: "vitamins",
    categoryLabel: "Vitaminas",
    themeColor: getColor("purple"),
    metrics: [
      {
        id: "a",
        label: "Vitamina A",
        unit: "µg",
        value: 10,
        default: 0,
        target: [45, 65],
        max: 300,
      },
      {
        id: "b12",
        label: "Vitamina B12",
        unit: "µg",
        value: 10,
        default: 0,
        target: [45, 65],
        max: 300,
      },
      {
        id: "b9",
        label: "Folato (B9)",
        unit: "µg",
        value: 10,
        default: 0,
        target: [45, 65],
        max: 300,
      },
      {
        id: "c",
        label: "Vitamina C",
        unit: "mg",
        value: 10,
        default: 0,
        target: [45, 65],
        max: 300,
      },
      {
        id: "d",
        label: "Vitamina D",
        unit: "IU",
        value: 10,
        default: 0,
        target: [45, 65],
        max: 300,
      },
      {
        id: "e",
        label: "Vitamina E",
        unit: "mg",
        value: 10,
        default: 0,
        target: [45, 65],
        max: 300,
      },
      {
        id: "k",
        label: "Vitamina K",
        unit: "µg",
        value: 10,
        default: 0,
        target: [45, 65],
        max: 300,
      },
    ],
  },
  {
    id: "minerals",
    categoryLabel: "Minerales",
    themeColor: getColor("blue"),
    metrics: [
      {
        id: "sodium",
        label: "Sodio",
        unit: "mg",
        value: 10,
        default: 0,
        target: [45, 65],
        max: 300,
      },
      {
        id: "potassium",
        label: "Potasio",
        unit: "mg",
        value: 10,
        default: 0,
        target: [45, 65],
        max: 300,
      },
      {
        id: "magnesium",
        label: "Magnesio",
        unit: "mg",
        value: 10,
        default: 0,
        target: [45, 65],
        max: 300,
      },
      {
        id: "calcium",
        label: "Calcio",
        unit: "mg",
        value: 10,
        default: 0,
        target: [45, 65],
        max: 300,
      },
      {
        id: "iron",
        label: "Hierro",
        unit: "mg",
        value: 10,
        default: 0,
        target: [45, 65],
        max: 300,
      },
      {
        id: "zinc",
        label: "Zinc",
        unit: "mg",
        value: 10,
        default: 0,
        target: [45, 65],
        max: 300,
      },
    ],
  },
  {
    id: "other",
    categoryLabel: "Otros",
    themeColor: getColor("foreground"),
    metrics: [
      {
        id: "water",
        label: "Agua",
        unit: "g",
        value: 10,
        default: 0,
        target: [45, 65],
        max: 300,
      },
      {
        id: "caffeine",
        label: "Cafeína",
        unit: "mg",
        value: 10,
        default: 0,
        target: [45, 65],
        max: 300,
      },
      {
        id: "alcohol",
        label: "Alcohol",
        unit: "g",
        value: 10,
        default: 0,
        target: [45, 65],
        max: 300,
      },
    ],
  },
];

export const getEmptyNutrients = (): NutrientsType => {
  return nutrientsData.reduce((acc, category) => {
    const categoryData = category.metrics.reduce<Record<string, number>>(
      (mAcc, metric) => {
        mAcc[metric.id] = metric.default;
        return mAcc;
      },
      {}
    );

    (acc as unknown as Record<string, Record<string, number>>)[category.id] =
      categoryData;
    return acc;
  }, {} as NutrientsType);
};

export function addNutrients(
  a: NutrientsType,
  b: NutrientsType
): NutrientsType {
  return nutrientsData.reduce((acc, category) => {
    const catId = category.id;
    const subA = a[catId] as Record<string, number>;
    const subB = b[catId] as Record<string, number>;

    const categoryData = category.metrics.reduce<Record<string, number>>(
      (mAcc, metric) => {
        const valA = subA[metric.id] ?? 0;
        const valB = subB[metric.id] ?? 0;
        mAcc[metric.id] = valA + valB;
        return mAcc;
      },
      {}
    );

    (acc as unknown as Record<string, Record<string, number>>)[catId] =
      categoryData;
    return acc;
  }, {} as NutrientsType);
}

export function multiplyNutrients(
  a: NutrientsType,
  ratio: number
): NutrientsType {
  return nutrientsData.reduce((acc, category) => {
    const catId = category.id;
    const subA = a[catId] as Record<string, number>;

    const categoryData = category.metrics.reduce<Record<string, number>>(
      (mAcc, metric) => {
        const valA = subA[metric.id] ?? 0;
        mAcc[metric.id] = valA * ratio;
        return mAcc;
      },
      {}
    );

    (acc as unknown as Record<string, Record<string, number>>)[catId] =
      categoryData;
    return acc;
  }, {} as NutrientsType);
}
