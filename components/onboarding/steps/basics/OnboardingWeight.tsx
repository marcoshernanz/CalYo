import SegmentedControl from "@/components/ui/SegmentedControl";
import Title from "@/components/ui/Title";
import WeightPicker from "@/components/weight/WeightPicker";
import { useOnboardingContext } from "@/context/OnboardingContext";
import kgToLbs from "@/lib/units/kgToLbs";
import lbsToKg from "@/lib/units/lbsToKg";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

const defaultWeight = 80;

export default function OnboardingWeight() {
  const { data, setData } = useOnboardingContext();

  const weight = data.weight ?? defaultWeight;

  const metricProps = useMemo<React.ComponentProps<typeof WeightPicker>>(() => {
    return {
      minWeight: 30,
      maxWeight: 300,
      initialWeight: Math.round(weight * 10) / 10,
      formatWeight: (weight: number) => {
        "worklet";
        return `${weight} kg`;
      },
      onChange: (weight: number) => {
        setData((prev) => ({ ...prev, weight }));
      },
    };
  }, [setData, weight]);

  const imperialProps = useMemo<
    React.ComponentProps<typeof WeightPicker>
  >(() => {
    return {
      minWeight: 70,
      maxWeight: 700,
      initialWeight: Math.round(kgToLbs(weight) * 10) / 10,
      formatWeight: (weight: number) => {
        "worklet";
        return `${weight} lbs`;
      },
      onChange: (weight: number) => {
        const convertedWeight = lbsToKg(weight);
        setData((prev) => ({ ...prev, weight: convertedWeight }));
      },
    };
  }, [setData, weight]);

  const handleMeasurementSystemChange = (system: string) => {
    if (system !== "Kilogramos" && system !== "Libras") return;
    setData((prev) => ({
      ...prev,
      measurementSystem: system === "Kilogramos" ? "metric" : "imperial",
    }));
  };

  return (
    <>
      <Title size="24">¿Cuanto pesas?</Title>
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
    </>
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
