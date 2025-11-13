import SegmentedControl from "@/components/ui/SegmentedControl";
import WeightPicker from "@/components/weight/WeightPicker";
import { useOnboardingContext } from "@/context/OnboardingContext";
import kgToLbs from "@/lib/units/kgToLbs";
import lbsToKg from "@/lib/units/lbsToKg";
import { StyleSheet, View } from "react-native";
import OnboardingStep from "../../OnboardingStep";

export default function OnboardingWeight() {
  const { data, setData } = useOnboardingContext();

  const weight = data.weight;

  const metricMinWeight = 30;
  const metricMaxWeight = 300;
  const metricInitialWeight = Math.min(
    Math.max(Math.round(weight * 10) / 10, metricMinWeight),
    metricMaxWeight
  );
  const metricProps: React.ComponentProps<typeof WeightPicker> = {
    minWeight: metricMinWeight,
    maxWeight: metricMaxWeight,
    initialWeight: metricInitialWeight,
    formatWeight: (nextWeight: number) => {
      "worklet";
      return `${nextWeight} kg`;
    },
    onChange: (nextWeight: number) => {
      setData((prev) => ({
        ...prev,
        weight: nextWeight,
        targetWeight: nextWeight,
      }));
    },
  };

  const imperialMinWeight = 70;
  const imperialMaxWeight = 700;
  const imperialInitialWeight = Math.min(
    Math.max(Math.round(kgToLbs(weight) * 10) / 10, imperialMinWeight),
    imperialMaxWeight
  );
  const imperialProps: React.ComponentProps<typeof WeightPicker> = {
    minWeight: imperialMinWeight,
    maxWeight: imperialMaxWeight,
    initialWeight: imperialInitialWeight,
    formatWeight: (nextWeight: number) => {
      "worklet";
      return `${nextWeight} lbs`;
    },
    onChange: (nextWeight: number) => {
      const weightKg = lbsToKg(nextWeight);
      setData((prev) => ({
        ...prev,
        weight: weightKg,
        targetWeight: weightKg,
      }));
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
    <OnboardingStep title="¿Cuanto pesas?">
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
          <WeightPicker key="metric-weight" {...metricProps} />
        ) : (
          <WeightPicker key="imperial-weight" {...imperialProps} />
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
