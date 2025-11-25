import CalorieIcon from "@/components/icons/macros/CalorieIcon";
import CarbIcon from "@/components/icons/macros/CarbIcon";
import FatIcon from "@/components/icons/macros/FatIcon";
import ProteinIcon from "@/components/icons/macros/ProteinIcon";
import CircularProgress from "@/components/ui/CircularProgress";
import {
  ScreenFooter,
  ScreenFooterButton,
} from "@/components/ui/screen/ScreenFooter";
import {
  ScreenHeader,
  ScreenHeaderBackButton,
  ScreenHeaderTitle,
} from "@/components/ui/screen/ScreenHeader";
import {
  ScreenMain,
  ScreenMainScrollView,
} from "@/components/ui/screen/ScreenMain";
import TextInput from "@/components/ui/TextInput";
import { api } from "@/convex/_generated/api";
import useScrollY from "@/lib/hooks/reanimated/useScrollY";
import getColor from "@/lib/ui/getColor";
import macrosToKcal from "@/lib/utils/macrosToKcal";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { LucideProps } from "lucide-react-native";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  cancelAnimation,
  SharedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Macro = {
  name: string;
  color: string;
  Icon: React.ComponentType<LucideProps>;
  value: number | undefined;
  setValue: React.Dispatch<React.SetStateAction<number | undefined>>;
  ratio: SharedValue<number>;
};

export default function AdjustMacroTargetsScreen() {
  const targets = useQuery(api.profiles.getProfile.default)?.targets;
  const updateProfile = useMutation(api.profiles.updateProfile.default);

  const router = useRouter();
  const { scrollY, onScroll } = useScrollY();

  const [calories, setCalories] = useState(targets?.calories);
  const [carbs, setCarbs] = useState(targets?.carbs);
  const [protein, setProtein] = useState(targets?.protein);
  const [fat, setFat] = useState(targets?.fat);

  const macrosCalories = macrosToKcal({ carbs, protein, fat });

  const caloriesRatio = useSharedValue(0);
  const carbsRatio = useSharedValue(0);
  const proteinRatio = useSharedValue(0);
  const fatRatio = useSharedValue(0);

  const macros: Macro[] = [
    {
      name: "Calorías",
      color: getColor("foreground"),
      Icon: CalorieIcon,
      value: calories,
      setValue: setCalories,
      ratio: caloriesRatio,
    },
    {
      name: "Carbohidratos",
      color: getColor("carb"),
      Icon: CarbIcon,
      value: carbs,
      setValue: setCarbs,
      ratio: carbsRatio,
    },
    {
      name: "Proteína",
      color: getColor("protein"),
      Icon: ProteinIcon,
      value: protein,
      setValue: setProtein,
      ratio: proteinRatio,
    },
    {
      name: "Grasa",
      color: getColor("fat"),
      Icon: FatIcon,
      value: fat,
      setValue: setFat,
      ratio: fatRatio,
    },
  ];

  const handleDone = async () => {
    await updateProfile({
      profile: {
        targets: {
          calories: calories ?? 0,
          carbs: carbs ?? 0,
          protein: protein ?? 0,
          fat: fat ?? 0,
        },
      },
    });
    router.back();
  };

  useEffect(() => {
    const calcRatio = (macros: Parameters<typeof macrosToKcal>[number]) => {
      "worklet";
      const calories = macrosToKcal(macros);
      const ratio = macrosCalories ? calories / macrosCalories : 0;
      return ratio;
    };

    const nextCaloriesRatio = Math.min(
      1,
      macrosCalories ? (calories ?? 0) / macrosCalories : 0
    );

    const duration = 1000;

    caloriesRatio.value = withTiming(nextCaloriesRatio, { duration });
    carbsRatio.value = withTiming(calcRatio({ carbs }), { duration });
    proteinRatio.value = withTiming(calcRatio({ protein }), { duration });
    fatRatio.value = withTiming(calcRatio({ fat }), { duration });

    return () => {
      cancelAnimation(carbsRatio);
      cancelAnimation(proteinRatio);
      cancelAnimation(fatRatio);
    };
  }, [
    calories,
    caloriesRatio,
    carbs,
    carbsRatio,
    fat,
    fatRatio,
    macrosCalories,
    protein,
    proteinRatio,
  ]);

  return (
    <ScreenMain edges={[]}>
      <ScreenHeader scrollY={scrollY}>
        <ScreenHeaderBackButton />
        <ScreenHeaderTitle title="Ajustar Objetivos" />
      </ScreenHeader>

      <ScreenMainScrollView
        scrollViewProps={{ onScroll }}
        safeAreaProps={{ edges: ["left", "right"] }}
      >
        <View style={styles.container}>
          {macros.map((macro, index) => (
            <View
              key={`macro-input-${macro.name}-${index}`}
              style={styles.macroRow}
            >
              <View style={styles.macroCardProgressContainer}>
                <CircularProgress
                  progress={macro.ratio}
                  color={macro.color}
                  strokeWidth={3}
                />
                <View style={styles.caloriesIconContainer}>
                  <macro.Icon size={16} strokeWidth={2.25} />
                </View>
              </View>
              <TextInput
                label={macro.name}
                value={String(macro.value ?? "")}
                inputMode="numeric"
                onChangeText={(text) => {
                  const numberText = text.replace(/[^0-9]/g, "");
                  macro.setValue(
                    numberText === "" ? undefined : Number(numberText)
                  );
                }}
                maxLength={5}
              />
            </View>
          ))}
        </View>
      </ScreenMainScrollView>

      <ScreenFooter style={styles.footer}>
        <ScreenFooterButton variant="outline" style={{ flex: 0 }}>
          Generar Automáticamente
        </ScreenFooterButton>
        <ScreenFooterButton
          style={{ flex: 0 }}
          onPress={() => void handleDone()}
        >
          Hecho
        </ScreenFooterButton>
      </ScreenFooter>
    </ScreenMain>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  macroRow: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 12,
  },
  macroCardProgressContainer: {
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  caloriesIconContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: getColor("muted"),
  },
  footer: {
    flexDirection: "column",
  },
});
