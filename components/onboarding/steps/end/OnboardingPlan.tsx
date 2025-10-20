import CircularProgress from "@/components/ui/CircularProgress";
import Description from "@/components/ui/Description";
import Title from "@/components/ui/Title";
import getColor from "@/lib/ui/getColor";
import { useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";
import AnimateableText from "react-native-animateable-text";
import {
  cancelAnimation,
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import OnboardingStep from "../../OnboardingStep";
import macrosToKcal from "@/lib/utils/macrosToKcal";

const carbs = 400;
const protein = 200;
const fat = 70;
const calories = macrosToKcal({ carbs, protein, fat });

const macros = [
  {
    name: "Calorías",
    amount: calories,
    ratio: 1,
    color: getColor("foreground"),
    formatAmount: (amount: number) => {
      "worklet";
      return `${Math.round(amount)}`;
    },
  },
  {
    name: "Hidratos",
    amount: carbs,
    ratio: macrosToKcal({ carbs }) / calories,
    color: getColor("carb"),
    formatAmount: (amount: number) => {
      "worklet";
      return `${Math.round(amount)}g`;
    },
  },
  {
    name: "Proteína",
    amount: protein,
    ratio: macrosToKcal({ protein }) / calories,
    color: getColor("protein"),
    formatAmount: (amount: number) => {
      "worklet";
      return `${Math.round(amount)}g`;
    },
  },
  {
    name: "Grasas",
    amount: fat,
    ratio: macrosToKcal({ fat }) / calories,
    color: getColor("fat"),
    formatAmount: (amount: number) => {
      "worklet";
      return `${Math.round(amount)}g`;
    },
  },
];

interface MacroCardProps {
  name: string;
  amount: number;
  ratio: number;
  formatAmount: (amount: number) => string;
  color: string;
}

function MacroCard({
  name,
  amount,
  ratio,
  formatAmount,
  color,
}: MacroCardProps) {
  const progress = useSharedValue(0);
  const progressRatio = useDerivedValue(() => ratio * progress.value);

  const animatedProps = {
    weightText: useAnimatedProps(() => ({
      text: `${formatAmount(Math.round(amount * progress.value))}`,
    })),
  };

  useEffect(() => {
    progress.value = withTiming(1, { duration: 1500 });

    return () => {
      cancelAnimation(progress);
      progress.value = 0;
    };
  }, [progress, ratio]);

  return (
    <View style={styles.macroCard}>
      <Title size="16" style={styles.macroName}>
        {name}
      </Title>
      <View style={styles.macroAmountContainer}>
        <AnimateableText
          animatedProps={animatedProps.weightText}
          style={styles.macroAmountText}
        />
        <CircularProgress progress={progressRatio} color={color} />
      </View>
    </View>
  );
}

export default function OnboardingPlan() {
  return (
    <OnboardingStep title="¡Enhorabuena! Tu plan personalizado está listo">
      <View style={styles.container}>
        <View style={styles.recommendationsContainer}>
          <View style={styles.header}>
            <Title size="18">Recomendaciones Diarias</Title>
            <Description size="14">
              Puedes cambiarlas cuando quieras
            </Description>
          </View>
          <View style={styles.macrosContainer}>
            {Array(2)
              .fill(0)
              .map((_, i) => (
                <View key={`macro-row-${i}`} style={styles.macroRow}>
                  {macros.slice(i * 2, i * 2 + 2).map((item) => (
                    <MacroCard
                      key={`macros-${item.name}-${item.amount}`}
                      {...item}
                    />
                  ))}
                </View>
              ))}
          </View>
        </View>
      </View>
    </OnboardingStep>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  recommendationsContainer: {
    backgroundColor: getColor("muted"),
    width: "100%",
    padding: 20,
    borderRadius: 16,
  },
  header: {
    gap: 2,
    paddingBottom: 24,
  },
  macrosContainer: {
    gap: 12,
  },
  macroRow: {
    flexDirection: "row",
    gap: 12,
  },
  macroCard: {
    backgroundColor: getColor("background"),
    flex: 1,
    padding: 12,
    borderRadius: 12,
    gap: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: getColor("secondary"),
  },
  macroName: {
    textAlign: "center",
    paddingBottom: 8,
  },
  macroAmountContainer: {
    width: "100%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  macroAmountText: {
    fontSize: 20,
    position: "absolute",
    fontWeight: 700,
    fontFamily: "Inter_700Bold",
    color: getColor("foreground"),
    ...(Platform.OS === "android" ? { includeFontPadding: false } : null),
  },
});
