import SegmentedControl from "@/components/ui/SegmentedControl";
import WheelPicker from "@/components/ui/WheelPicker";
import { useOnboardingContext } from "@/context/OnboardingContext";
import inToFtIn from "@/lib/units/inToFtIn";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import OnboardingStep from "../../OnboardingStep";
import mToIn from "@/lib/units/mToIn";
import inToM from "@/lib/units/inToM";

export default function OnboardingHeight() {
  const dimensions = useWindowDimensions();
  const { data, setData } = useOnboardingContext();

  const heightCm = (data.height ?? 100) * 100;

  const metricMinHeightCm = 120;
  const metricMaxHeightCm = 240;
  const metricInitialHeightCm = Math.min(
    Math.max(Math.round(heightCm), metricMinHeightCm),
    metricMaxHeightCm
  );
  const metricData = Array.from(
    { length: metricMaxHeightCm - metricMinHeightCm + 1 },
    (_, i) => `${metricMinHeightCm + i} cm`
  );
  const metricProps: React.ComponentProps<typeof WheelPicker> = {
    data: metricData,
    initialValue: `${metricInitialHeightCm} cm`,
    onValueChange: (value: string) => {
      const match = /^(\d+)\s*cm$/.exec(value);
      if (!match) return;
      const nextHeight = parseInt(match.at(1) ?? "0") / 100;
      setData((prev) => ({ ...prev, height: nextHeight }));
    },
  };

  const imperialMinHeight = 48;
  const imperialMaxHeight = 96;
  const imperialInitialHeight = Math.min(
    Math.max(Math.round(mToIn(heightCm / 100)), imperialMinHeight),
    imperialMaxHeight
  );
  const initialImperial = inToFtIn(imperialInitialHeight);
  const imperialData = Array.from(
    { length: imperialMaxHeight - imperialMinHeight + 1 },
    (_, i) => {
      const { feet, inches } = inToFtIn(imperialMinHeight + i);
      return `${feet} ft ${inches} in`;
    }
  );
  const imperialProps: React.ComponentProps<typeof WheelPicker> = {
    data: imperialData,
    initialValue: `${initialImperial.feet} ft ${initialImperial.inches} in`,
    onValueChange: (value: string) => {
      const match = /^(\d+)\s*ft\s*(\d+)\s*in$/.exec(value);
      if (!match) return;
      const feet = parseInt(match.at(1) ?? "0");
      const inches = parseInt(match.at(2) ?? "0");
      const totalInches = feet * 12 + inches;
      const nextHeight = Math.round(inToM(totalInches) * 100) / 100;
      setData((prev) => ({ ...prev, height: nextHeight }));
    },
  };

  const handleMeasurementSystemChange = (system: string) => {
    if (system !== "Centímetros" && system !== "Pies y Pulgadas") return;
    setData((prev) => ({
      ...prev,
      measurementSystem: system === "Centímetros" ? "metric" : "imperial",
    }));
  };

  return (
    <OnboardingStep title="¿Cuanto mides?">
      <View style={[style.pickerContainer, { width: dimensions.width }]}>
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

        {data.measurementSystem === "metric" ? (
          <WheelPicker key="metric-wheel" {...metricProps} />
        ) : (
          <WheelPicker key="imperial-wheel" {...imperialProps} />
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
  },
  pickerContainer: {
    marginLeft: -16,
    flex: 1,
  },
});
