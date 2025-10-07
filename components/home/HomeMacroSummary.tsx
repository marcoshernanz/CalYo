import { FlameIcon, LucideIcon, LucideWheat } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import Text from "../ui/Text";
import getColor from "@/lib/utils/getColor";
import CircularProgress from "../ui/CircularProgress";

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
          <Text size="12" weight="700" color={getColor("mutedForeground")}>
            Calorías
          </Text>
          <View style={styles.caloriesValueContainer}>
            <Text size="32" weight="600">
              1532
            </Text>
            <Text
              size="16"
              color={getColor("mutedForeground")}
              style={styles.targetText}
            >
              {" "}
              / 2000
            </Text>
          </View>
        </View>
        <View style={styles.progressContainer}>
          <CircularProgress
            progress={1532 / 2000}
            color={getColor("foreground")}
            strokeWidth={6}
          />
          <View style={styles.caloriesIconContainer}>
            <FlameIcon size={20} />
          </View>
        </View>
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
    padding: 20,
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
  targetText: {
    paddingBottom: 4,
  },
  progressContainer: {
    height: 80,
    width: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  caloriesIconContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: getColor("secondary"),
  },
  cardsContainer: {
    flexDirection: "row",
  },
});
