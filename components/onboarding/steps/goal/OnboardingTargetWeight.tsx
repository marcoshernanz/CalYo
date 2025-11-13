import SegmentedControl from "@/components/ui/SegmentedControl";
import WeightPicker from "@/components/weight/WeightPicker";
import { useOnboardingContext } from "@/context/OnboardingContext";
import kgToLbs from "@/lib/units/kgToLbs";
import lbsToKg from "@/lib/units/lbsToKg";
import { StyleSheet, View } from "react-native";
import OnboardingStep from "../../OnboardingStep";

export default function OnboardingTargetWeight() {
  const { data, setData } = useOnboardingContext();

  const initialWeight = data.weight;
  const initialWeightLbs = Math.round(kgToLbs(initialWeight) * 10) / 10;
  const targetWeight = data.targetWeight;
  const targetWeightLbs = Math.round(kgToLbs(targetWeight) * 10) / 10;

  const metricProps: React.ComponentProps<typeof WeightPicker> = {
    minWeight: data.goal === "lose" ? 30 : initialWeight,
    maxWeight: data.goal === "gain" ? 300 : initialWeight,
    initialWeight: Math.round(targetWeight * 10) / 10,
    highlightedWeight: initialWeight,
    highlightSide: data.goal === "lose" ? "right" : "left",
    formatWeight: (nextWeight: number) => {
      "worklet";
      return `${nextWeight} kg`;
    },
    onChange: (nextWeight: number) => {
      setData((prev) => ({ ...prev, targetWeight: nextWeight }));
    },
  };

  const imperialProps: React.ComponentProps<typeof WeightPicker> = {
    minWeight: data.goal === "lose" ? 70 : initialWeightLbs,
    maxWeight: data.goal === "gain" ? 700 : initialWeightLbs,
    initialWeight: targetWeightLbs,
    highlightedWeight: initialWeightLbs,
    highlightSide: data.goal === "lose" ? "right" : "left",
    formatWeight: (nextWeight: number) => {
      "worklet";
      return `${nextWeight} lbs`;
    },
    onChange: (nextWeight: number) => {
      setData((prev) => ({ ...prev, targetWeight: lbsToKg(nextWeight) }));
    },
  };

  const handleMeasurementSystemChange = (system: string) => {
    if (system !== "Kilogramos" && system !== "Libras") return;
    setData((prev) => ({
      ...prev,
      measurementSystem: system === "Kilogramos" ? "metric" : "imperial",
    }));
  };

  return (
    <OnboardingStep title="¿Qué peso te gustaría alcanzar?">
      <View style={style.pickerContainer}>
        <View style={style.segmentControlContainer}>
          <SegmentedControl
            options={["Kilogramos", "Libras"]}
            selectedOption={
              data.measurementSystem === "metric" ? "Kilogramos" : "Libras"
            }
            onChange={handleMeasurementSystemChange}
          />
        </View>
        {data.measurementSystem === "metric" ? (
          <WeightPicker {...metricProps} />
        ) : (
          <WeightPicker {...imperialProps} />
        )}
      </View>
    </OnboardingStep>
  );
}

const style = StyleSheet.create({
  segmentControlContainer: {
    position: "absolute",
    left: "50%",
    transform: [{ translateX: "-50%" }],
    zIndex: 2,
  },
  pickerContainer: {
    flex: 1,
  },
});
