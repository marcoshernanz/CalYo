import { ScrollView } from "react-native";
import SafeArea from "../ui/SafeArea";
import MealFooter from "./MealFooter";
import MealHeader from "./MealHeader";
import MealIngredients from "./MealIngredients";
import MealMacros from "./MealMacros";
import Text from "../ui/Text";

export default function Meal() {
  return (
    <SafeArea>
      <MealHeader />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Text weight="600" style={{ fontSize: 22 }}>
          Meal Title
        </Text>
        <MealMacros />
        <MealIngredients />
      </ScrollView>
      <MealFooter />
    </SafeArea>
  );
}
