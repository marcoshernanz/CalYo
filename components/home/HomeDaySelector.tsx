import { useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { addDays, format, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";
import Text from "../ui/Text";
import getColor from "@/lib/utils/getColor";
import CircularProgress from "../ui/CircularProgress";
import {
  cancelAnimation,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type DayData = {
  id: string;
  letter: string;
  number: string;
  carbs: number;
  protein: number;
  fat: number;
};

interface DaySelectorItemProps {
  day: DayData;
  isSelected: boolean;
  isToday: boolean;
}

function DaySelectorItem({ day, isSelected, isToday }: DaySelectorItemProps) {
  const progress = useSharedValue(0);
  const progressCarbs = useDerivedValue(() => day.carbs * progress.value);
  const progressProtein = useDerivedValue(() => day.protein * progress.value);
  const progressFat = useDerivedValue(() => day.fat * progress.value);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 1500 });

    return () => {
      cancelAnimation(progress);
      progress.value = 0;
    };
  }, [progress]);

  return (
    <View
      style={[
        styles.dayContainer,
        {
          backgroundColor: isSelected
            ? getColor("background")
            : isToday
              ? getColor("background", 0.6)
              : "transparent",
        },
      ]}
    >
      <Text weight="600">{day.letter}</Text>
      <View style={styles.dayProgressContainer}>
        <Text size="14" weight="600" style={styles.dayNumberText}>
          {day.number}
        </Text>
        <CircularProgress
          progress={[progressCarbs, progressProtein, progressFat]}
          color={[getColor("emerald"), getColor("red"), getColor("yellow")]}
          strokeWidth={4}
        />
      </View>
    </View>
  );
}

export default function HomeDaySelector() {
  const selectedDate = format(new Date(), "yyyy-MM-dd");
  const today = format(new Date(), "yyyy-MM-dd");

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
        <DaySelectorItem
          key={day.id}
          day={day}
          isSelected={day.id === selectedDate}
          isToday={day.id === today}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 4,
    paddingBottom: 16,
  },
  dayContainer: {
    alignItems: "center",
    gap: 4,
    flex: 1,
    paddingVertical: 8,
    borderRadius: 999,
  },
  dayProgressContainer: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  dayNumberText: {
    position: "absolute",
  },
});
