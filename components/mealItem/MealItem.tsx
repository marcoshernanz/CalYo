import { Doc, Id } from "@/convex/_generated/dataModel";
import {
  ScreenMain,
  ScreenMainScrollView,
  ScreenMainTitle,
} from "../ui/screen/ScreenMain";
import {
  ScreenHeader,
  ScreenHeaderBackButton,
  ScreenHeaderTitle,
} from "../ui/screen/ScreenHeader";
import useScrollY from "@/lib/hooks/reanimated/useScrollY";
import scaleMacrosPer100g from "@/lib/utils/nutrition/scaleMacrosPer100g";
import MealMacros from "../meal/MealMacros";
import SafeArea from "../ui/SafeArea";
import Carousel from "../ui/Carousel";
import MealMicros from "../meal/MealMicros";
import scaleMicrosPer100g from "@/lib/utils/nutrition/scaleMicrosPer100g";
import TextInput from "../ui/TextInput";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ScreenFooter, ScreenFooterButton } from "../ui/screen/ScreenFooter";

type Props = {
  mealItemId: Id<"mealItems">;
  name?: string;
  mealItem?: Doc<"mealItems">;
  loading: boolean;
};

export default function MealItem({
  mealItemId,
  name,
  mealItem,
  loading,
}: Props) {
  const { scrollY, onScroll } = useScrollY();
  const [grams, setGrams] = useState<number | undefined>(
    Math.round(mealItem?.grams ?? 100)
  );

  const macrosPer100g = mealItem?.macrosPer100g ?? {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
  };
  const microsPer100g = mealItem?.microsPer100g ?? {
    score: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
  };

  const totalMacros = scaleMacrosPer100g({
    grams: grams ?? 0,
    macrosPer100g,
  });
  const totalMicros = scaleMicrosPer100g({
    grams: grams ?? 0,
    microsPer100g,
  });

  return (
    <ScreenMain edges={[]}>
      <ScreenHeader scrollY={scrollY}>
        <ScreenHeaderBackButton />
        <ScreenHeaderTitle title="Ingrediente" />
      </ScreenHeader>

      <ScreenMainScrollView
        scrollViewProps={{ onScroll }}
        safeAreaProps={{ edges: [] }}
      >
        <SafeArea edges={["left", "right"]} style={styles.safeArea}>
          <View style={styles.headerContainer}>
            <ScreenMainTitle
              title={name}
              loading={loading}
              style={styles.title}
            />
            <TextInput
              value={String(grams ?? "")}
              onChangeText={(text) => {
                const numberText = text.replace(/[^0-9]/g, "");
                setGrams(numberText === "" ? undefined : Number(numberText));
              }}
              suffix="g"
              inputMode="numeric"
              maxLength={4}
              cardStyle={styles.textInputCard}
              style={{ textAlign: "center" }}
            />
          </View>
        </SafeArea>
        <Carousel style={styles.carousel}>
          <MealMacros macros={totalMacros} loading={loading} />
          <MealMicros
            source="mealItem"
            id={mealItemId}
            micros={totalMicros}
            loading={loading}
          />
        </Carousel>
      </ScreenMainScrollView>

      <ScreenFooter style={{ boxShadow: [] }}>
        <ScreenFooterButton
          onPress={() => {
            // router.dismissTo("/app");
          }}
        >
          Hecho
        </ScreenFooterButton>
      </ScreenFooter>
    </ScreenMain>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 0,
  },
  headerContainer: {
    flexDirection: "row",
    gap: 12,
    paddingBottom: 16,
    alignItems: "center",
  },
  title: {
    flex: 1,
    paddingBottom: 0,
  },
  textInputCard: {
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 80,
  },
  carousel: {
    paddingBottom: 32,
  },
});
