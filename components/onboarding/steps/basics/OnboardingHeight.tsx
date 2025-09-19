import SegmentedControl from "@/components/ui/SegmentedControl";
import Title from "@/components/ui/Title";
import WheelPicker from "@/components/ui/WheelPicker";
import { useOnboardingContext } from "@/context/OnboardingContext";
import cmToIn from "@/lib/units/cmToIn";
import inToCm from "@/lib/units/inToCm";
import inToFtIn from "@/lib/units/inToFtIn";
import { useMemo, useRef } from "react";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";

const minHeight = 120;
const maxHeight = 240;
const defaultHeight = 170;

export default function OnboardingHeight() {
  const { data, setData } = useOnboardingContext();

  const metricWheelRef = useRef<FlatList<string>>(null);
  const imperialWheelRef = useRef<FlatList<string>>(null);

  const height = data.height ?? defaultHeight;

  const metricOptions = useMemo(() => {
    return Array.from(
      { length: maxHeight - minHeight + 1 },
      (_, i) => `${minHeight + i} cm`
    );
  }, []);

  const imperialOptions = useMemo(() => {
    const minInches = Math.round(cmToIn(minHeight));
    const maxInches = Math.round(cmToIn(maxHeight));
    return Array.from({ length: maxInches - minInches + 1 }, (_, i) => {
      const { feet, inches } = inToFtIn(minInches + i);
      return `${feet} ft ${inches} in`;
    });
  }, []);

  const handleMeasurementSystemChange = (system: string) => {
    if (system !== "Centímetros" && system !== "Pies y Pulgadas") return;
    setData((prev) => ({
      ...prev,
      measurementSystem: system === "Centímetros" ? "metric" : "imperial",
    }));

    if (system === "Centímetros") {
      const cm = Math.round(height);
      const index = metricOptions.findIndex((option) => option === `${cm} cm`);
      console.log(index);
      metricWheelRef.current?.scrollToIndex({ index, animated: false });
    } else {
      const totalInches = cmToIn(height);
      const { feet, inches } = inToFtIn(totalInches);
      const index = imperialOptions.findIndex(
        (option) => option === `${feet} ft ${inches} in`
      );
      console.log(index);
      imperialWheelRef.current?.scrollToIndex({ index, animated: false });
    }
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
    const height = Math.round(inToCm(totalInches));
    setData((prev) => ({ ...prev, height }));
  };

  const initialValue = useMemo(() => {
    if (data.measurementSystem === "metric") {
      return `${Math.round(height)} cm`;
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

        <View style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              display: data.measurementSystem === "metric" ? "flex" : "none",
            }}
          >
            <WheelPicker
              ref={metricWheelRef}
              data={metricOptions}
              onValueChange={handleHeightChange}
              initialValue={initialValue}
            />
          </View>
          <View
            style={{
              flex: 1,
              display: data.measurementSystem === "imperial" ? "flex" : "none",
            }}
          >
            <WheelPicker
              ref={imperialWheelRef}
              data={imperialOptions}
              onValueChange={handleHeightChange}
              initialValue={initialValue}
            />
          </View>
        </View>
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
