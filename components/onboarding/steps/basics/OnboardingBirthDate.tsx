import WheelPicker from "@/components/ui/WheelPicker";
import { useOnboardingContext } from "@/context/OnboardingContext";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { format, getDaysInMonth } from "date-fns";
import { es } from "date-fns/locale";
import OnboardingStep from "../../OnboardingStep";

export default function OnboardingBirthDate() {
  const dimensions = useWindowDimensions();
  const { data, setData } = useOnboardingContext();

  const date = new Date(data.birthDate);

  const currentYear = new Date().getFullYear();
  const startYear = 1900;
  const years = Array.from({ length: currentYear - startYear }, (_, i) =>
    String(startYear + i)
  );

  const months = Array.from({ length: 12 }, (_, i) => {
    const name = format(new Date(2020, i, 1), "LLLL", { locale: es });
    return name.charAt(0).toUpperCase() + name.slice(1);
  });

  const days = Array.from({ length: getDaysInMonth(date) }, (_, i) =>
    String(i + 1)
  );

  const selectedDate = {
    day: String(date.getDate()),
    month: months[date.getMonth()],
    year: String(date.getFullYear()),
  };

  const handleDayChange = (value: string) => {
    const day = parseInt(value);
    setData((prev) => ({
      ...prev,
      bornDate: new Date(date.getFullYear(), date.getMonth(), day).getTime(),
    }));
  };

  const handleMonthChange = (value: string) => {
    const monthIndex = months.findIndex((m) => m === value);
    const maxDay = getDaysInMonth(new Date(date.getFullYear(), monthIndex, 1));
    const safeDay = Math.min(date.getDate(), maxDay);
    setData((prev) => ({
      ...prev,
      bornDate: new Date(date.getFullYear(), monthIndex, safeDay).getTime(),
    }));
  };

  const handleYearChange = (value: string) => {
    const year = parseInt(value);
    const maxDay = getDaysInMonth(new Date(year, date.getMonth(), 1));
    const safeDay = Math.min(date.getDate(), maxDay);
    setData((prev) => ({
      ...prev,
      bornDate: new Date(year, date.getMonth(), safeDay).getTime(),
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
