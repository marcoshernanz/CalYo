import SegmentedControl from "@/components/ui/SegmentedControl";
import WheelPicker from "@/components/ui/WheelPicker";
import { useOnboardingContext } from "@/context/OnboardingContext";
import cmToIn from "@/lib/units/cmToIn";
import inToCm from "@/lib/units/inToCm";
import inToFtIn from "@/lib/units/inToFtIn";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import OnboardingStep from "../../OnboardingStep";

const defaultHeight = 170;

export default function OnboardingHeight() {
  const dimensions = useWindowDimensions();
  const { data, setData } = useOnboardingContext();

  const height = data.height ?? defaultHeight;

  const metricMinHeight = 120;
  const metricMaxHeight = 240;
  const metricInitialHeight = Math.min(
    Math.max(Math.round(height), metricMinHeight),
    metricMaxHeight
  );
  const metricData = Array.from(
    { length: metricMaxHeight - metricMinHeight + 1 },
    (_, i) => `${metricMinHeight + i} cm`
  );
  const metricProps: React.ComponentProps<typeof WheelPicker> = {
    data: metricData,
    initialValue: `${metricInitialHeight} cm`,
    onValueChange: (value: string) => {
      const match = value.match(/^(\d+)\s*cm$/);
      if (!match) return;
      const nextHeight = parseInt(match[1]);
      setData((prev) => ({ ...prev, height: nextHeight }));
    },
  };

  const imperialMinHeight = 48;
  const imperialMaxHeight = 96;
  const imperialInitialHeight = Math.min(
    Math.max(Math.round(cmToIn(height)), imperialMinHeight),
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
      const match = value.match(/^(\d+)\s*ft\s*(\d+)\s*in$/);
      if (!match) return;
      const feet = parseInt(match[1]);
      const inches = parseInt(match[2]);
      const totalInches = feet * 12 + inches;
      const nextHeight = Math.round(inToCm(totalInches));
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
