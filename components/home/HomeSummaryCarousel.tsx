import { ScrollView, useWindowDimensions } from "react-native";
import HomeMacroSummary from "./HomeMacroSummary";

type Props = {
  dayTotals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
};

export default function HomeSummaryCarousel({ dayTotals }: Props) {
  const dimensions = useWindowDimensions();

  return (
    <ScrollView
      horizontal
      style={{
        flexGrow: 0,
        width: dimensions.width,
        overflow: "visible",
      }}
      contentContainerStyle={{
        width: dimensions.width * 2,
      }}
      showsHorizontalScrollIndicator={false}
      pagingEnabled
    >
      <HomeMacroSummary totals={dayTotals} />
      <HomeMacroSummary totals={dayTotals} />
    </ScrollView>
  );
}
