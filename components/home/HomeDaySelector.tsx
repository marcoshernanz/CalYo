import { Dispatch, SetStateAction, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { addDays, format, getDay, startOfWeek } from "date-fns";
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
import Button from "../ui/Button";
import macrosToKcal from "@/lib/utils/macrosToKcal";
import calcRatio from "@/lib/utils/calcRatio";

type DayData = {
  weekDay: number;
  letter: string;
  number: string;
  carbsRatio: number;
  proteinRatio: number;
  fatRatio: number;
}

type DaySelectorItemProps = {
  day: DayData;
  isSelected: boolean;
  isToday: boolean;
  onPress: () => void;
}

function DaySelectorItem({
  day,
  isSelected,
  isToday,
  onPress,
}: DaySelectorItemProps) {
  const progress = useSharedValue(0);
  const progressCarbs = useDerivedValue(() => day.carbsRatio * progress.value);
  const progressProtein = useDerivedValue(
    () => day.proteinRatio * progress.value
  );
  const progressFat = useDerivedValue(() => day.fatRatio * progress.value);

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
      onPress={onPress}
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

type Props = {
  selectedDay: number;
  setSelectedDay: Dispatch<SetStateAction<number>>;
  weekTotals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }[];
}

export default function HomeDaySelector({
  selectedDay,
  setSelectedDay,
  weekTotals,
}: Props) {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays: DayData[] = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(start, index);
    const calories = Math.max(2000, macrosToKcal(weekTotals[index]));
    const carbsRatio = calcRatio(
      macrosToKcal({ carbs: weekTotals[index].carbs }),
      calories
    );
    const proteinRatio = calcRatio(
      macrosToKcal({ protein: weekTotals[index].protein }),
      calories
    );
    const fatRatio = calcRatio(
      macrosToKcal({ fat: weekTotals[index].fat }),
      calories
    );

    return {
      weekDay: (getDay(date) + 6) % 7,
      letter: format(date, "EEEEE", { locale: es }).toUpperCase(),
      number: format(date, "dd", { locale: es }),
      carbsRatio: isNaN(carbsRatio) ? 0 : carbsRatio,
      proteinRatio: isNaN(proteinRatio) ? 0 : proteinRatio,
      fatRatio: isNaN(fatRatio) ? 0 : fatRatio,
    };
  });

  return (
    <View style={styles.container}>
      {weekDays.map((day) => (
        <DaySelectorItem
          key={`day-${day.weekDay}-${day.number}`}
          day={day}
          isSelected={selectedDay === day.weekDay}
          isToday={day.weekDay === (getDay(new Date()) + 6) % 7}
          onPress={() => { setSelectedDay(day.weekDay); }}
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
