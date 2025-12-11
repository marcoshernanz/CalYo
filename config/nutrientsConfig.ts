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

export const nutrientsData: NutrientCategory[] = [
  {
    id: "carbs",
    categoryLabel: "Carbohidratos y Azúcares",
    themeColor: getColor("carb"),
    metrics: [
      {
        id: "total",
        label: "Hidratos Totales",
        unit: "g",
        value: 0,
        default: 0,
        target: [225, 325],
        max: 400,
      },
      {
        id: "net",
        label: "Hidratos Netos",
        unit: "g",
        value: 0,
        default: 0,
        target: [200, 300],
        max: 350,
      },
      {
        id: "fiber",
        label: "Fibra",
        unit: "g",
        value: 0,
        default: 0,
        target: [25, 40],
        max: 60,
      },
      {
        id: "sugar",
        label: "Azúcares Totales",
        unit: "g",
        value: 0,
        default: 0,
        target: [0, 50],
        max: 100,
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
        value: 0,
        default: 0,
        target: [44, 78],
        max: 120,
      },
      {
        id: "saturated",
        label: "Saturadas",
        unit: "g",
        value: 0,
        default: 0,
        target: [0, 22],
        max: 50,
      },
      {
        id: "monounsaturated",
        label: "Monoinsaturadas",
        unit: "g",
        value: 0,
        default: 0,
        target: [25, 45],
        max: 80,
      },
      {
        id: "polyunsaturated",
        label: "Poliinsaturadas",
        unit: "g",
        value: 0,
        default: 0,
        target: [12, 22],
        max: 40,
      },
      {
        id: "trans",
        label: "Trans",
        unit: "g",
        value: 0,
        default: 0,
        target: [0, 2],
        max: 5,
      },
      {
        id: "cholesterol",
        label: "Colesterol",
        unit: "mg",
        value: 0,
        default: 0,
        target: [0, 300],
        max: 600,
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
        value: 0,
        default: 0,
        target: [60, 150],
        max: 220,
      },
      {
        id: "leucine",
        label: "Leucina",
        unit: "g",
        value: 0,
        default: 0,
        target: [3, 10],
        max: 15,
      },
      {
        id: "isoleucine",
        label: "Isoleucina",
        unit: "g",
        value: 0,
        default: 0,
        target: [1.5, 6],
        max: 10,
      },
      {
        id: "valine",
        label: "Valina",
        unit: "g",
        value: 0,
        default: 0,
        target: [2, 6],
        max: 10,
      },
      {
        id: "tryptophan",
        label: "Triptófano",
        unit: "g",
        value: 0,
        default: 0,
        target: [0.5, 1.5],
        max: 3,
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
        value: 0,
        default: 0,
        target: [700, 1500],
        max: 3000,
      },
      {
        id: "b12",
        label: "Vitamina B12",
        unit: "µg",
        value: 0,
        default: 0,
        target: [2.4, 10],
        max: 25,
      },
      {
        id: "b9",
        label: "Folato (B9)",
        unit: "µg",
        value: 0,
        default: 0,
        target: [400, 800],
        max: 1200,
      },
      {
        id: "c",
        label: "Vitamina C",
        unit: "mg",
        value: 0,
        default: 0,
        target: [75, 200],
        max: 1000,
      },
      {
        id: "d",
        label: "Vitamina D",
        unit: "IU",
        value: 0,
        default: 0,
        target: [600, 2000],
        max: 4000,
      },
      {
        id: "e",
        label: "Vitamina E",
        unit: "mg",
        value: 0,
        default: 0,
        target: [15, 30],
        max: 50,
      },
      {
        id: "k",
        label: "Vitamina K",
        unit: "µg",
        value: 0,
        default: 0,
        target: [90, 150],
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
        value: 0,
        default: 0,
        target: [1500, 2300],
        max: 4000,
      },
      {
        id: "potassium",
        label: "Potasio",
        unit: "mg",
        value: 0,
        default: 0,
        target: [3000, 4700],
        max: 6000,
      },
      {
        id: "magnesium",
        label: "Magnesio",
        unit: "mg",
        value: 0,
        default: 0,
        target: [320, 420],
        max: 800,
      },
      {
        id: "calcium",
        label: "Calcio",
        unit: "mg",
        value: 0,
        default: 0,
        target: [1000, 1500],
        max: 2500,
      },
      {
        id: "iron",
        label: "Hierro",
        unit: "mg",
        value: 0,
        default: 0,
        target: [8, 18],
        max: 45,
      },
      {
        id: "zinc",
        label: "Zinc",
        unit: "mg",
        value: 0,
        default: 0,
        target: [11, 25],
        max: 40,
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
        unit: "ml",
        value: 0,
        default: 0,
        target: [2000, 3500],
        max: 5000,
      },
      {
        id: "caffeine",
        label: "Cafeína",
        unit: "mg",
        value: 0,
        default: 0,
        target: [0, 400],
        max: 600,
      },
      {
        id: "alcohol",
        label: "Alcohol",
        unit: "g",
        value: 0,
        default: 0,
        target: [0, 15],
        max: 100,
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
