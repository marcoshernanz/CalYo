import SegmentedControl from "@/components/ui/SegmentedControl";
import Title from "@/components/ui/Title";
import WheelPicker from "@/components/ui/WheelPicker";
import { useOnboardingContext } from "@/context/OnboardingContext";
import cmToIn from "@/lib/units/cmToIn";
import inToCm from "@/lib/units/inToCm";
import inToFtIn from "@/lib/units/inToFtIn";
import { useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";

const defaultHeight = 170;

export default function OnboardingHeight() {
  const { data, setData } = useOnboardingContext();

  const height = data.height ?? defaultHeight;

  const options = useMemo(() => {
    const minHeight = 120;
    const maxHeight = 240;
    if (data.measurementSystem === "metric") {
      return Array.from(
        { length: maxHeight - minHeight + 1 },
        (_, i) => `${minHeight + i} cm`
      );
    }

    const minInches = Math.round(cmToIn(minHeight));
    const maxInches = Math.round(cmToIn(maxHeight));
    return Array.from({ length: maxInches - minInches + 1 }, (_, i) => {
      const { feet, inches } = inToFtIn(minInches + i);
      return `${feet} ft ${inches} in`;
    });
  }, [data.measurementSystem]);

  const handleMeasurementSystemChange = (system: string) => {
    if (system !== "Centímetros" && system !== "Pies y Pulgadas") return;
    setData((prev) => ({
      ...prev,
      measurementSystem: system === "Centímetros" ? "metric" : "imperial",
    }));
  };

  const handleHeightChange = (value: string) => {
    if (data.measurementSystem === "metric") {
      const match = value.match(/^(\d+)\s*cm$/);
      if (!match) return;
      const height = parseInt(match[1]);
      setData((prev) => ({ ...prev, height }));
      return;
    }

    const match = value.match(/^(\d+)\s*ft\s*(\d+)\s*in$/);
    if (!match) return;
    const feet = parseInt(match[1]);
    const inches = parseInt(match[2]);
    const totalInches = feet * 12 + inches;
    const height = inToCm(totalInches);
    setData((prev) => ({ ...prev, height }));
  };

  const initialValue = useMemo(() => {
    if (data.measurementSystem === "metric") {
      return `${height} cm`;
    }

    const totalInches = cmToIn(height);
    const { feet, inches } = inToFtIn(totalInches);
    return `${feet} ft ${inches} in`;
  }, [data.measurementSystem, height]);

  return (
    <>
      <Title size="24">¿Cuanto mides?</Title>
      <View style={style.pickerContainer}>
        <View style={style.segmentControlContainer}>
          <SegmentedControl
            options={["Centímetros", "Pies y Pulgadas"]}
            selectedOption={
              data.measurementSystem === "metric"
                ? "Centímetros"
                : "Pies y Pulgadas"
            }
            onChange={handleMeasurementSystemChange}
          />
        </View>

        <WheelPicker
          data={options}
          onValueChange={handleHeightChange}
          initialValue={initialValue}
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
