import Dot3Icon from "@/components/icons/Dot3Icon";
import Dot1Icon from "@/components/icons/Dot1Icon";
import Select, { SelectOption } from "@/components/ui/Select";
import { useOnboardingContext } from "@/context/OnboardingContext";
import Dot6Icon from "@/components/icons/Dot6Icon";
import OnboardingStep from "../../OnboardingStep";

const options: SelectOption[] = [
  {
    name: "0-2",
    label: "0-2",
    description: "Entreno de vez en cuando",
    Icon: Dot1Icon,
  },
  {
    name: "3-5",
    label: "3-5",
    description: "Entreno varias veces por semana",
    Icon: Dot3Icon,
  },
  {
    name: "6+",
    label: "6+",
    description: "Entreno casi a diario",
    Icon: Dot6Icon,
  },
];

export default function OnboardingWeeklyWorkouts() {
  const { data, setData } = useOnboardingContext();

  const selectedOptions = data.weeklyWorkouts ? [data.weeklyWorkouts] : [];
  const setSelectedOption = (name: string) => {
    if (name === "0-2" || name === "3-5" || name === "6+") {
      setData((prev) => ({ ...prev, weeklyWorkouts: name }));
    }
  };

  return (
    <OnboardingStep title="¿Cuantos entrenamientos haces a la semana?">
      <Select
        options={options}
        selectedOptions={selectedOptions}
        onSelectOption={setSelectedOption}
        animated
        animationDelay={100}
      />
    </OnboardingStep>
  );
}
