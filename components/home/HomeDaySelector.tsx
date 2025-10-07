import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { addDays, format, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";
import Text from "../ui/Text";
import getColor from "@/lib/utils/getColor";
import CircularProgress from "../ui/CircularProgress";

export default function HomeDaySelector() {
  const selectedDate = format(new Date(), "yyyy-MM-dd");

  const weekDays = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const letters = ["L", "M", "X", "J", "V", "S", "D"];

    return letters.map((letter, index) => {
      const date = addDays(start, index);

      return {
        id: format(date, "yyyy-MM-dd"),
        letter,
        number: format(date, "dd", { locale: es }),
        carbs: 0.4,
        protein: 0.2,
        fat: 0.1,
      };
    });
  }, []);

  return (
    <View style={styles.container}>
      {weekDays.map((day) => (
        <View
          key={`day-${day.id}`}
          style={[
            styles.dayContainer,
            {
              backgroundColor:
                day.id === selectedDate
                  ? getColor("background")
                  : "transparent",
            },
          ]}
        >
          <Text style={styles.dayLetterText}>{day.letter}</Text>
          <View style={styles.dayProgressContainer}>
            <Text size="14" style={styles.dayNumberText}>
              {day.number}
            </Text>
            <CircularProgress
              progress={[day.carbs, day.protein, day.fat]}
              color={[getColor("emerald"), getColor("red"), getColor("yellow")]}
              strokeWidth={4}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 4,
  },
  dayContainer: {
    alignItems: "center",
    gap: 4,
    flex: 1,
    paddingVertical: 8,
    borderRadius: 999,
  },
  dayLetterText: {
    fontWeight: "600",
  },
  dayProgressContainer: {
    width: 36,
    height: 36,
    borderColor: getColor("foreground"),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
  },
  dayNumberText: {
    fontWeight: "600",
    position: "absolute",
  },
});
