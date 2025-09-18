import SegmentedControl from "@/components/ui/SegmentedControl";
import Title from "@/components/ui/Title";
import WheelPicker from "@/components/ui/WheelPicker";
import { useOnboardingContext } from "@/context/OnboardingContext";
import { Dimensions, StyleSheet, View } from "react-native";

export default function OnboardingHeight() {
  const { data, setData } = useOnboardingContext();

  const handleMeasurementSystemChange = (system: string) => {
    if (system !== "Centímetros" && system !== "Pies y Pulgadas") return;
    setData((prev) => ({
      ...prev,
      measurementSystem: system === "Centímetros" ? "metric" : "imperial",
    }));
  };

  return (
    <>
      <Title size="24">¿Cuanto mides?</Title>
      <View style={style.pickerContainer}>
        <View style={style.segmentControlContainer}>
          <SegmentedControl
            options={["Pies y Pulgadas", "Centímetros"]}
            selectedOption={
              data.measurementSystem === "metric"
                ? "Centímetros"
                : "Pies y Pulgadas"
            }
            onChange={handleMeasurementSystemChange}
          />
        </View>

        <WheelPicker
          data={Array.from({ length: 91 }, (_, i) => `${120 + i} cm`)}
          onValueChange={(value) =>
            setData((prev) => ({
              ...prev,
              height: (() => {
                const match = value.match(/\d+/);
                return match ? parseInt(match[0], 10) : null;
              })(),
            }))
          }
          initialValue="170 cm"
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
    width: Dimensions.get("window").width,
    marginLeft: -16,
    flex: 1,
  },
});
