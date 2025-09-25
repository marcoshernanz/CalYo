import SegmentedControl from "@/components/ui/SegmentedControl";
import WheelPicker from "@/components/ui/WheelPicker";
import { useOnboardingContext } from "@/context/OnboardingContext";
import cmToIn from "@/lib/units/cmToIn";
import inToCm from "@/lib/units/inToCm";
import inToFtIn from "@/lib/units/inToFtIn";
import { useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import OnboardingStep from "../../OnboardingStep";

const defaultHeight = 170;

export default function OnboardingHeight() {
  const { data, setData } = useOnboardingContext();

  const height = data.height ?? defaultHeight;

  const metricProps = useMemo<React.ComponentProps<typeof WheelPicker>>(() => {
    const minHeight = 120;
    const maxHeight = 240;

    return {
      data: Array.from(
        { length: maxHeight - minHeight + 1 },
        (_, i) => `${minHeight + i} cm`
      ),
      initialValue: `${Math.round(height)} cm`,
      onValueChange: (value: string) => {
        const match = value.match(/^(\d+)\s*cm$/);
        if (!match) return;
        const height = parseInt(match[1]);
        setData((prev) => ({ ...prev, height }));
      },
    };
  }, [height, setData]);

  const imperialProps = useMemo<
    React.ComponentProps<typeof WheelPicker>
  >(() => {
    const minHeight = 48;
    const maxHeight = 96;
    const { feet, inches } = inToFtIn(cmToIn(height));

    return {
      data: Array.from({ length: maxHeight - minHeight + 1 }, (_, i) => {
        const { feet, inches } = inToFtIn(minHeight + i);
        return `${feet} ft ${inches} in`;
      }),
      initialValue: `${feet} ft ${inches} in`,
      onValueChange: (value: string) => {
        const match = value.match(/^(\d+)\s*ft\s*(\d+)\s*in$/);
        if (!match) return;
        const feet = parseInt(match[1]);
        const inches = parseInt(match[2]);
        const totalInches = feet * 12 + inches;
        const height = Math.round(inToCm(totalInches));
        setData((prev) => ({ ...prev, height }));
      },
    };
  }, [height, setData]);

  const handleMeasurementSystemChange = (system: string) => {
    if (system !== "Centímetros" && system !== "Pies y Pulgadas") return;
    setData((prev) => ({
      ...prev,
      measurementSystem: system === "Centímetros" ? "metric" : "imperial",
    }));
  };

  return (
    <OnboardingStep title="¿Cuanto mides?">
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

        {data.measurementSystem === "metric" ? (
          <WheelPicker {...metricProps} />
        ) : (
          <WheelPicker {...imperialProps} />
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
    width: Dimensions.get("window").width,
    marginLeft: -16,
    flex: 1,
  },
});
