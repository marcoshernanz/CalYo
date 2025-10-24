import { ScrollView, StyleSheet } from "react-native";
import SafeArea from "../ui/SafeArea";
import MealFooter from "./MealFooter";
import MealHeader from "./MealHeader";
import MealIngredients from "./MealIngredients";
import MealMacros from "./MealMacros";
import Text from "../ui/Text";
import { Id } from "@/convex/_generated/dataModel";

interface Props {
  mealId: Id<"meals">;
  totals: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
  items: {
    foodId: Id<"fdcFoods">;
    name: string;
    calories: number;
    grams: number;
  }[];
}

export default function Meal({ mealId, totals, items }: Props) {
  return (
    <SafeArea>
      <MealHeader mealId={mealId} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Text weight="600" style={{ fontSize: 22 }}>
          Meal Title
        </Text>
        <MealMacros totals={totals} />
        <MealIngredients items={items} />
      </ScrollView>
      <MealFooter />
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
});
