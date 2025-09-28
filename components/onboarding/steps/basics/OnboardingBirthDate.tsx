import WheelPicker from "@/components/ui/WheelPicker";
import { useOnboardingContext } from "@/context/OnboardingContext";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { useMemo } from "react";
import { format, getDaysInMonth } from "date-fns";
import { es } from "date-fns/locale";
import OnboardingStep from "../../OnboardingStep";

const defaultDate = new Date(2000, 6, 15);

export default function OnboardingBirthDate() {
  const dimensions = useWindowDimensions();
  const { data, setData } = useOnboardingContext();

  const date = data?.bornDate ?? defaultDate;

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const start = 1900;
    return Array.from({ length: currentYear - start }, (_, i) =>
      String(start + i)
    );
  }, []);

  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const name = format(new Date(2020, i, 1), "LLLL", { locale: es });
      return name.charAt(0).toUpperCase() + name.slice(1);
    });
  }, []);

  const days = useMemo(() => {
    const numDays = getDaysInMonth(date);
    return Array.from({ length: numDays }, (_, i) => String(i + 1));
  }, [date]);

  const selectedDate = useMemo(() => {
    return {
      day: String(date.getDate()),
      month: months[date.getMonth()],
      year: String(date.getFullYear()),
    };
  }, [date, months]);

  const handleDayChange = (value: string) => {
    const day = parseInt(value);
    setData((prev) => ({
      ...prev,
      bornDate: new Date(date.getFullYear(), date.getMonth(), day),
    }));
  };

  const handleMonthChange = (value: string) => {
    const monthIndex = months.findIndex((m) => m === value);
    const maxDay = getDaysInMonth(new Date(date.getFullYear(), monthIndex, 1));
    const safeDay = Math.min(date.getDate(), maxDay);
    setData((prev) => ({
      ...prev,
      bornDate: new Date(date.getFullYear(), monthIndex, safeDay),
    }));
  };

  const handleYearChange = (value: string) => {
    const year = parseInt(value);
    const maxDay = getDaysInMonth(new Date(year, date.getMonth(), 1));
    const safeDay = Math.min(date.getDate(), maxDay);
    setData((prev) => ({
      ...prev,
      bornDate: new Date(year, date.getMonth(), safeDay),
    }));
  };

  return (
    <OnboardingStep title="¿Cuándo naciste?">
      <View style={[style.pickerContainer, { width: dimensions.width }]}>
        <WheelPicker
          data={days}
          initialValue={selectedDate.day}
          onValueChange={handleDayChange}
          itemStyle={{ paddingLeft: 16 }}
        />
        <WheelPicker
          data={months}
          initialValue={selectedDate.month}
          onValueChange={handleMonthChange}
        />
        <WheelPicker
          data={years}
          initialValue={selectedDate.year}
          onValueChange={handleYearChange}
          itemStyle={{ paddingRight: 16 }}
        />
      </View>
    </OnboardingStep>
  );
}

const style = StyleSheet.create({
  pickerContainer: {
    marginLeft: -16,
    flex: 1,
    flexDirection: "row",
  },
});
