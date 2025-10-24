import { ScrollView, StyleSheet } from "react-native";
import SafeArea from "../ui/SafeArea";
import MealFooter from "./MealFooter";
import MealHeader from "./MealHeader";
import MealIngredients from "./MealIngredients";
import MealMacros from "./MealMacros";
import Text from "../ui/Text";

interface Props {
  name: string;
  mealId: React.ComponentProps<typeof MealHeader>["mealId"];
  totals: React.ComponentProps<typeof MealMacros>["totals"];
  items: React.ComponentProps<typeof MealIngredients>["items"];
}

export default function Meal({ name, mealId, totals, items }: Props) {
  return (
    <SafeArea>
      <MealHeader mealId={mealId} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Text weight="600" style={{ fontSize: 22 }}>
          {name}
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
