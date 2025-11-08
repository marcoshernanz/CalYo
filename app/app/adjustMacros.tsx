import CalorieIcon from "@/components/icons/macros/CalorieIcon";
import CarbIcon from "@/components/icons/macros/CarbIcon";
import CircularProgress from "@/components/ui/CircularProgress";
import {
  ScreenFooter,
  ScreenFooterButton,
} from "@/components/ui/screen/ScreenFooter";
import {
  ScreenHeader,
  ScreenHeaderBackButton,
  ScreenHeaderTitle,
} from "@/components/ui/screen/ScreenHeader";
import {
  ScreenMain,
  ScreenMainScrollView,
} from "@/components/ui/screen/ScreenMain";
import TextInput from "@/components/ui/TextInput";
import { api } from "@/convex/_generated/api";
import useScrollY from "@/lib/hooks/reanimated/useScrollY";
import getColor from "@/lib/ui/getColor";
import { useQuery } from "convex/react";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";

export default function AdjustMacrosScreen() {
  const targets = useQuery(api.profiles.getTargets.default);

  const { scrollY, onScroll } = useScrollY();
  const [calories, setCalories] = useState(targets?.calories);

  const macroRatio = useSharedValue(0.75);

  return (
    <ScreenMain edges={[]}>
      <ScreenHeader scrollY={scrollY}>
        <ScreenHeaderBackButton />
        <ScreenHeaderTitle title="Ajustar Objetivos" />
      </ScreenHeader>

      <ScreenMainScrollView
        scrollViewProps={{ onScroll }}
        safeAreaProps={{ edges: ["left", "right"] }}
      >
        <View style={styles.macroRow}>
          <View style={styles.macroCardProgressContainer}>
            <CircularProgress
              progress={macroRatio}
              color={getColor("foreground")}
              strokeWidth={3}
            />
            <View style={styles.caloriesIconContainer}>
              <CalorieIcon size={16} strokeWidth={2.25} />
            </View>
          </View>
          <TextInput
            label="Calorías"
            // value={calories}
            value="32"
            inputMode="numeric"
            // onChangeText={(text) => {
            //   setCalories(text.replace(/[^0-9]/g, ""));
            // }}
            // maxLength={5}
          />
        </View>
        {/* <TextInput label="Calorías" />
        <TextInput label="Calorías" />
        <TextInput label="Calorías" />
        <TextInput label="Calorías" /> */}
      </ScreenMainScrollView>

      <ScreenFooter>
        <ScreenFooterButton>Generar Automáticamente</ScreenFooterButton>
      </ScreenFooter>
    </ScreenMain>
  );
}

const styles = StyleSheet.create({
  macroRow: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 12,
  },
  macroCardProgressContainer: {
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  caloriesIconContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: getColor("muted"),
  },
});
