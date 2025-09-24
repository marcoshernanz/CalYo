import Select, { SelectOption } from "@/components/ui/Select";
import { useOnboardingContext } from "@/context/OnboardingContext";
import {
  SignalIcon,
  SignalLowIcon,
  SignalMediumIcon,
  SignalZeroIcon,
} from "lucide-react-native";
import OnboardingStep from "../../OnboardingStep";

const options: SelectOption[] = [
  {
    name: "none",
    label: "Ninguna",
    description: "No hago cardio",
    Icon: SignalZeroIcon,
  },
  {
    name: "beginner",
    label: "Principiante",
    description: "Llevo menos de 1 año haciendo cardio",
    Icon: SignalLowIcon,
  },
  {
    name: "intermediate",
    label: "Intermedio",
    description: "Llevo entre 1 y 4 años haciendo cardio",
    Icon: SignalMediumIcon,
  },
  {
    name: "advanced",
    label: "Avanzado",
    description: "Llevo más de 4 años haciendo cardio",
    Icon: SignalIcon,
  },
];

export default function OnboardingCardioExperience() {
  const { data, setData } = useOnboardingContext();

  const selectedOptions = data.cardioExperience ? [data.cardioExperience] : [];
  const setSelectedOption = (name: string) => {
    if (
      name === "none" ||
      name === "beginner" ||
      name === "intermediate" ||
      name === "advanced"
    ) {
      setData((prev) => ({ ...prev, cardioExperience: name }));
    }
  };

  return (
    <OnboardingStep title="¿Cual es tu experiencia con el cardio?">
      <Select
        options={options}
        selectedOptions={selectedOptions}
        onSelectOption={setSelectedOption}
      />
    </OnboardingStep>
  );
}
