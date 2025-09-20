import SegmentedControl from "@/components/ui/SegmentedControl";
import Title from "@/components/ui/Title";
import WeightPicker from "@/components/weight/WeightPicker";
import { useOnboardingContext } from "@/context/OnboardingContext";
import { StyleSheet, View } from "react-native";

const minWeight = 30;
const maxWeight = 300;
const defaultWeight = 80;

export default function OnboardingWeight() {
  const { data, setData } = useOnboardingContext();

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
        <WeightPicker
          minWeight={minWeight}
          maxWeight={maxWeight}
          defaultWeight={defaultWeight}
        />
      </View>
    </>
  );
}

const style = StyleSheet.create({
  segmentControlContainer: {
    position: "absolute",
    left: "50%",
    transform: [{ translateX: "-50%" }],
  },
  pickerContainer: {
    flex: 1,
  },
});
