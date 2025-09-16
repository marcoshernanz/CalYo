import Select, { SelectOption } from "@/components/ui/Select";
import Title from "@/components/ui/Title";
import { useOnboardingContext } from "@/context/OnboardingContext";
import {
  SignalIcon,
  SignalLowIcon,
  SignalMediumIcon,
  SignalZeroIcon,
} from "lucide-react-native";

const options: SelectOption[] = [
  {
    name: "none",
    label: "Ninguna",
    description: "No he levantado pesas antes",
    Icon: SignalZeroIcon,
  },
  {
    name: "beginner",
    label: "Principiante",
    description: "Llevo menos de 1 año levantando pesas",
    Icon: SignalLowIcon,
  },
  {
    name: "intermediate",
    label: "Intermedio",
    description: "Llevo entre 1 y 4 años levantando pesas",
    Icon: SignalMediumIcon,
  },
  {
    name: "advanced",
    label: "Avanzado",
    description: "Llevo más de 4 años levantando pesas",
    Icon: SignalIcon,
  },
];

export default function OnboardingLiftingExperience() {
  const { data, setData } = useOnboardingContext();

  const selectedOptions = data.liftingExperience
    ? [data.liftingExperience]
    : [];
  const setSelectedOption = (name: string) => {
    if (
      name === "none" ||
      name === "beginner" ||
      name === "intermediate" ||
      name === "advanced"
    ) {
      setData((prev) => ({ ...prev, liftingExperience: name }));
    }
  };

  return (
    <>
      <Title size="24">¿Cuál es tu experiencia levantando pesas?</Title>
      <Select
        options={options}
        selectedOptions={selectedOptions}
        onSelectOption={setSelectedOption}
      />
    </>
  );
}
