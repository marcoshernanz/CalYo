import { FlatList, StyleSheet, View } from "react-native";
import Text from "../ui/Text";
import { format } from "date-fns";

type Item = {
  name: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  date: Date;
};

const data: Item[] = [
  {
    name: "Banana",
    calories: 105,
    carbs: 27,
    protein: 1,
    fat: 0,
    date: new Date(new Date().setHours(8, 0, 0, 0)),
  },
  {
    name: "Chicken Breast (100g)",
    calories: 165,
    carbs: 0,
    protein: 31,
    fat: 3.6,
    date: new Date(new Date().setHours(12, 0, 0, 0)),
  },
  {
    name: "White Rice (100g)",
    calories: 130,
    carbs: 28,
    protein: 2.7,
    fat: 0.3,
    date: new Date(new Date().setHours(18, 0, 0, 0)),
  },
  {
    name: "Broccoli (100g)",
    calories: 34,
    carbs: 7,
    protein: 2.8,
    fat: 0.4,
    date: new Date(new Date().setHours(14, 0, 0, 0)),
  },
  {
    name: "Apple",
    calories: 95,
    carbs: 25,
    protein: 0.5,
    fat: 0.3,
    date: new Date(new Date().setHours(10, 0, 0, 0)),
  },
  {
    name: "Salmon (100g)",
    calories: 206,
    carbs: 0,
    protein: 22,
    fat: 13,
    date: new Date(new Date().setHours(20, 0, 0, 0)),
  },
  {
    name: "Pasta (100g)",
    calories: 157,
    carbs: 31,
    protein: 5.8,
    fat: 0.9,
    date: new Date(new Date().setHours(13, 0, 0, 0)),
  },
  {
    name: "Eggs (2)",
    calories: 143,
    carbs: 0.7,
    protein: 12.6,
    fat: 9.5,
    date: new Date(new Date().setHours(7, 0, 0, 0)),
  },
  {
    name: "Greek Yogurt (100g)",
    calories: 59,
    carbs: 3.6,
    protein: 10,
    fat: 0.4,
    date: new Date(new Date().setHours(9, 0, 0, 0)),
  },
  {
    name: "Whole Wheat Bread (1 slice)",
    calories: 81,
    carbs: 15,
    protein: 3.6,
    fat: 1.1,
    date: new Date(new Date().setHours(16, 0, 0, 0)),
  },
];

interface LogItemProps {
  item: Item;
}

function LogItem({ item }: LogItemProps) {
  return (
    <View>
      <Text>{item.name}</Text>
      <Text>{item.calories}</Text>
      <Text>{item.carbs}</Text>
      <Text>{item.protein}</Text>
      <Text>{item.fat}</Text>
      <Text>{format(item.date, "HH:mm")}</Text>
    </View>
  );
}

export default function HomeRecentlyLogged() {
  return (
    <View style={styles.container}>
      <Text size="24" weight="600">
        Recientemente añadido
      </Text>
      <FlatList
        data={data}
        renderItem={({ item, index }) => (
          <LogItem key={`log-item-${index}-${item.name}`} item={item} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 28,
  },
});
