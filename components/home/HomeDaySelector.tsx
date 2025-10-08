import { useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { addDays, format, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";
import Text from "../ui/Text";
import getColor from "@/lib/ui/getColor";
import CircularProgress from "../ui/CircularProgress";
import {
  cancelAnimation,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import getShadow from "@/lib/ui/getShadow";
import { useAppStateContext } from "@/context/AppStateContext";
import Button from "../ui/Button";

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
}

function DaySelectorItem({ day }: DaySelectorItemProps) {
  const progress = useSharedValue(0);
  const progressCarbs = useDerivedValue(() => day.carbs * progress.value);
  const progressProtein = useDerivedValue(() => day.protein * progress.value);
  const progressFat = useDerivedValue(() => day.fat * progress.value);

  const { selectedDay, setSelectedDay } = useAppStateContext();

  const isSelected = day.id === format(selectedDay, "yyyy-MM-dd");
  const isToday = day.id === format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    progress.value = withTiming(1, { duration: 1500 });

    return () => {
      cancelAnimation(progress);
      progress.value = 0;
    };
  }, [progress]);

  return (
    <Button
      variant="base"
      size="base"
      style={[
        styles.dayContainer,
        {
          backgroundColor: isSelected
            ? getColor("background")
            : isToday
              ? getColor("background", 0.6)
              : "transparent",
        },
        isSelected && getShadow("md"),
        isSelected && {
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: getColor("secondary"),
        },
      ]}
      onPress={() => setSelectedDay(new Date(day.id))}
    >
      <Text size="14" weight="600">
        {day.letter}
      </Text>
      <View style={styles.dayProgressContainer}>
        <Text size="12" weight="600" style={styles.dayNumberText}>
          {day.number}
        </Text>
        <CircularProgress
          progress={[progressCarbs, progressProtein, progressFat]}
          color={[getColor("carb"), getColor("protein"), getColor("fat")]}
          trackColor={getColor("mutedForeground", 0.2)}
          strokeWidth={3}
        />
      </View>
    </Button>
  );
}

export default function HomeDaySelector() {
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
        <DaySelectorItem key={day.id} day={day} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 4,
    paddingBottom: 16,
    justifyContent: "space-between",
  },
  dayContainer: {
    alignItems: "center",
    gap: 6,
    flex: 1,
    paddingVertical: 8,
    borderRadius: 999,
    maxWidth: 48,
  },
  dayProgressContainer: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  dayNumberText: {
    position: "absolute",
  },
});
