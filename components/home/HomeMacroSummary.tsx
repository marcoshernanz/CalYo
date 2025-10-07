import { LucideIcon, LucideWheat } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import Text from "../ui/Text";
import getColor from "@/lib/utils/getColor";

type Macro = {
  name: string;
  value: number;
  target: number;
  Icon: LucideIcon;
};

interface MacroCardProps {
  macro: Macro;
}

function MacroCard({ macro }: MacroCardProps) {
  return (
    <View>
      <macro.Icon />
      <Text>{macro.name}</Text>
      <Text>{macro.value}</Text>
      <Text>{macro.target}</Text>
    </View>
  );
}

const macros = [
  {
    name: "Carbohidratos",
    value: 250,
    target: 300,
    Icon: LucideWheat,
  },
  {
    name: "Proteínas",
    value: 150,
    target: 200,
    Icon: LucideWheat,
  },
  {
    name: "Grasas",
    value: 70,
    target: 100,
    Icon: LucideWheat,
  },
];

export default function HomeMacroSummary() {
  return (
    <View style={styles.container}>
      <View style={styles.caloriesContainer}>
        <View style={styles.caloriesTextContainer}>
          <Text style={styles.labelText}>Calorías</Text>
          <View style={styles.caloriesValueContainer}>
            <Text size="32" weight="600">
              1532
            </Text>
            <Text style={styles.targetText}>/2000</Text>
          </View>
        </View>
        <View style={styles.progressContainer}></View>
      </View>
      <View style={styles.cardsContainer}>
        {macros.map((macro) => (
          <MacroCard key={`macro-${macro.name}`} macro={macro} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  caloriesContainer: {
    backgroundColor: getColor("background"),
    padding: 24,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  caloriesTextContainer: {},
  caloriesValueContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  labelText: {
    color: getColor("mutedForeground"),
  },
  targetText: {
    color: getColor("mutedForeground"),
  },
  progressContainer: {
    height: 86,
    width: 86,
    backgroundColor: "red",
  },
  cardsContainer: {
    flexDirection: "row",
  },
});
