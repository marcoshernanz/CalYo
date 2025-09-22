import Slider from "@/components/ui/Slider";
import Title from "@/components/ui/Title";
import { View } from "react-native";
import { useSharedValue } from "react-native-reanimated";

const minValue = 0.1;
const maxValue = 2;
const recommendedRange = [0.2, 0.8] as [number, number];

export default function OnboardingWeightChangeRate() {
  const changeRate = useSharedValue(50);

  return (
    <>
      <Title size="24">¿Cómo de rápido quieres alcanzar tu objetivo?</Title>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Slider
          minValue={minValue}
          maxValue={maxValue}
          value={changeRate}
          highlightedRange={recommendedRange}
        />
      </View>
    </>
  );
}
