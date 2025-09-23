import Slider from "@/components/ui/Slider";
import Text from "@/components/ui/Text";
import Title from "@/components/ui/Title";
import getColor from "@/lib/utils/getColor";
import { Platform, StyleSheet, View } from "react-native";
import AnimateableText from "react-native-animateable-text";
import { useAnimatedProps, useSharedValue } from "react-native-reanimated";

const minValue = 0.1;
const maxValue = 1.5;
const initialValue = 0.5;
const recommendedRange = [0.3, 0.8] as [number, number];

const getMessage = (rate: number) => {
  "worklet";

  const roundedRate = Math.round(rate * 10) / 10;

  if (rate < recommendedRange[0]) {
    return "Lento";
  } else if (rate > recommendedRange[1]) {
    return "Rápido (Ten Precaución)";
  } else if (roundedRate === initialValue) {
    return "Estándar (Recomendado)";
  } else {
    return "Estándar";
  }
};

export default function OnboardingWeightChangeRate() {
  const changeRate = useSharedValue(initialValue);

  const animatedProps = {
    messageText: useAnimatedProps(() => ({
      text: getMessage(changeRate.value),
    })),
  };

  const animatedStyles = {
    messageText: useAnimatedProps(() => ({
      backgroundColor:
        changeRate.value >= recommendedRange[0] &&
        changeRate.value <= recommendedRange[1]
          ? getColor("primaryLight")
          : getColor("secondary"),
    })),
  };

  return (
    <>
      <Title size="24">¿Cómo de rápido quieres alcanzar tu objetivo?</Title>
      <View style={styles.container}>
        <AnimateableText
          animatedProps={animatedProps.messageText}
          style={[styles.messageText, animatedStyles.messageText]}
        />
        <Slider
          minValue={minValue}
          maxValue={maxValue}
          value={changeRate}
          initialValue={initialValue}
          highlightedRange={recommendedRange}
        />
        <View style={styles.weightInfo}>
          <View style={styles.row}>
            <Text size="24" style={styles.changeDirection}>
              +
            </Text>
            <View style={styles.valueContainer}>
              <Text style={styles.valueNumber}>0.2</Text>
              <Text style={styles.valueUnit}>kg</Text>
            </View>
            <Text style={styles.periodLabel}>Por Semana</Text>
          </View>
          <View style={styles.row}>
            <Text size="24" style={styles.changeDirection}>
              +
            </Text>
            <View style={styles.valueContainer}>
              <Text style={styles.valueNumber}>0.8</Text>
              <Text style={styles.valueUnit}>kg</Text>
            </View>
            <Text style={styles.periodLabel}>Por Mes</Text>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  messageText: {
    fontSize: 16,
    position: "absolute",
    fontWeight: 600,
    fontFamily: "Inter_600SemiBold",
    color: getColor("foreground"),
    ...(Platform.OS === "android" ? { includeFontPadding: false } : null),
    bottom: "50%",
    transform: [{ translateY: -52 }],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  weightInfo: {
    position: "absolute",
    gap: 8,
    top: "50%",
    transform: [{ translateY: 52 }],
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  changeDirection: {
    fontWeight: 300,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    gap: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: getColor("mutedForeground"),
  },
  valueNumber: {
    fontWeight: 600,
  },
  valueUnit: {
    color: getColor("mutedForeground"),
  },
  periodLabel: {
    paddingLeft: 8,
  },
});
