import Slider from "@/components/ui/Slider";
import Title from "@/components/ui/Title";
import { View } from "react-native";
import { useSharedValue } from "react-native-reanimated";

export default function OnboardingWeightChangeRate() {
  const changeRate = useSharedValue(50);

  return (
    <>
      <Title size="24">¿Cómo de rápido quieres alcanzar tu objetivo?</Title>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Slider minValue={0} maxValue={100} value={changeRate} />
      </View>
    </>
  );
}
