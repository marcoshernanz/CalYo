import Title from "@/components/ui/Title";
import WheelPicker from "@/components/ui/WheelPicker";
import { useOnboardingContext } from "@/context/OnboardingContext";
import { Dimensions, StyleSheet, View } from "react-native";

export default function OnboardingHeight() {
  const { setData } = useOnboardingContext();

  return (
    <>
      <Title size="24">¿Cuanto mides?</Title>
      <View style={style.pickerContainer}>
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
          defaultValue="170 cm" // TODO
        />
      </View>
    </>
  );
}

const style = StyleSheet.create({
  pickerContainer: {
    width: Dimensions.get("window").width,
    marginLeft: -16,
    flex: 1,
  },
});
