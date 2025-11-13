import Slider from "@/components/ui/Slider";
import Text from "@/components/ui/Text";
import {
  OnboardingData,
  useOnboardingContext,
} from "@/context/OnboardingContext";
import kgToLbs from "@/lib/units/kgToLbs";
import lbsToKg from "@/lib/units/lbsToKg";
import getColor from "@/lib/ui/getColor";
import { StyleSheet, View } from "react-native";
import AnimateableText from "react-native-animateable-text";
import {
  SharedValue,
  useAnimatedProps,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import OnboardingStep from "../../OnboardingStep";
import resolveFontFamily from "@/lib/ui/resolveFontFamily";

const minKg = 0.1;
const minLbs = 0.2;
const maxKg = 1.5;
const maxLbs = 3.3;
const defaultKg = 0.5;
const defaultLbs = 1.0;
const recommendedKg = [0.25, 0.85] as [number, number];
const recommendedLbs = [0.65, 1.75] as [number, number];

export default function OnboardingWeightChangeRate() {
  const { data, setData } = useOnboardingContext();

  const isMetric = data.measurementSystem !== "imperial";

  const displayBounds = isMetric
    ? { min: minKg, max: maxKg, def: defaultKg, rec: recommendedKg }
    : { min: minLbs, max: maxLbs, def: defaultLbs, rec: recommendedLbs };

  const initialDisplayValue = isMetric
    ? data.weightChangeRate
    : kgToLbs(data.weightChangeRate * 10) / 10;

  const changeRate = useSharedValue(initialDisplayValue);

  const weeklyRate = useDerivedValue(() => {
    return Math.round(changeRate.value * 10) / 10;
  });
  const monthlyRate = useDerivedValue(() => {
    return (Math.round(changeRate.value * 10) / 10) * 4;
  });

  const changeSign = data.goal === "lose" ? "-" : "+";
  const unitLabel = isMetric ? "kg" : "lbs";

  const getMessage = (rate: number, rec: [number, number], def: number) => {
    "worklet";
    const roundedRate = Math.round(rate * 10) / 10;
    if (rate < rec[0]) {
      return "Lento";
    } else if (rate > rec[1]) {
      return "Rápido (Ten Precaución)";
    } else if (roundedRate === def) {
      return "Estándar (Recomendado)";
    } else {
      return "Estándar";
    }
  };

  const animatedProps = {
    tooltip: useAnimatedProps(() => ({
      text: getMessage(changeRate.value, displayBounds.rec, displayBounds.def),
    })),
  };

  const animatedStyles = {
    tooltip: useAnimatedProps(() => ({
      backgroundColor:
        changeRate.value >= displayBounds.rec[0] &&
        changeRate.value <= displayBounds.rec[1]
          ? getColor("primaryLight")
          : getColor("secondary"),
    })),
  };

  useAnimatedReaction(
    () => changeRate.value,
    (value) => {
      const roundedValue = Math.round(value * 10) / 10;
      scheduleOnRN(syncWeightChangeRate, roundedValue, isMetric, setData);
    },
    [isMetric, setData]
  );

  return (
    <OnboardingStep title="¿Cómo de rápido quieres alcanzar tu objetivo?">
      <View style={styles.container}>
        <View style={styles.tooltipContainer}>
          <AnimateableText
            animatedProps={animatedProps.tooltip}
            style={[styles.tooltip, animatedStyles.tooltip]}
          />
        </View>
        <Slider
          minValue={displayBounds.min}
          maxValue={displayBounds.max}
          value={changeRate}
          initialValue={initialDisplayValue}
          highlightedRange={displayBounds.rec}
        />
        <View style={styles.weightChange}>
          {[
            { amount: weeklyRate, period: "Por Semana" },
            { amount: monthlyRate, period: "Por Mes" },
          ].map(({ amount, period }) => (
            <WeightChangeRow
              key={`row-${period}`}
              sign={changeSign}
              amount={amount}
              period={period}
              unit={unitLabel}
            />
          ))}
        </View>
      </View>
    </OnboardingStep>
  );
}

function syncWeightChangeRate(
  roundedDisplayValue: number,
  isMetric: boolean,
  setData: (updater: (prev: OnboardingData) => OnboardingData) => void
) {
  const valueKg = isMetric
    ? roundedDisplayValue
    : Math.round(lbsToKg(roundedDisplayValue) * 10) / 10;
  setData((prev) => ({
    ...prev,
    weightChangeRate: valueKg,
  }));
}

type WeightChangeRowProps = {
  sign: string;
  amount: SharedValue<number>;
  period: string;
  unit: string;
};

function WeightChangeRow({ sign, amount, period, unit }: WeightChangeRowProps) {
  const animatedProps = {
    amount: useAnimatedProps(() => ({
      text: String(amount.value),
    })),
  };

  return (
    <View style={styles.row}>
      <Text size="24" weight="300">
        {sign}
      </Text>
      <View style={styles.valueContainer}>
        <AnimateableText
          animatedProps={animatedProps.amount}
          style={styles.valueNumber}
        />
        <Text size="16" weight="500" color={getColor("mutedForeground", 0.5)}>
          {unit}
        </Text>
      </View>
      <Text size="16" style={styles.periodLabel}>
        {period}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tooltipContainer: {
    position: "absolute",
    bottom: "50%",
    transform: [{ translateY: -36 }],
  },
  tooltip: {
    fontSize: 16,
    fontFamily: resolveFontFamily({ weight: 600 }),
    color: getColor("foreground"),
    includeFontPadding: false,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  weightChange: {
    position: "absolute",
    gap: 8,
    top: "50%",
    transform: [{ translateY: 36 }],
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 86,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: getColor("mutedForeground", 0.5),
  },
  valueNumber: {
    fontSize: 16,
    fontFamily: resolveFontFamily({ weight: 600 }),
    color: getColor("foreground"),
    includeFontPadding: false,
  },
  periodLabel: {
    paddingLeft: 8,
  },
});
