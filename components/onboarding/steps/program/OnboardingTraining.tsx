import Select, { SelectOption } from "@/components/ui/Select";
import { useOnboardingContext } from "@/context/OnboardingContext";
import {
  ArmchairIcon,
  CheckCheckIcon,
  DumbbellIcon,
  HeartPulseIcon,
} from "lucide-react-native";
import OnboardingStep from "../../OnboardingStep";

const options: SelectOption[] = [
  { name: "none", label: "Ninguno", Icon: ArmchairIcon },
  { name: "lifting", label: "Levantamiento de Pesas", Icon: DumbbellIcon },
  { name: "cardio", label: "Cardio", Icon: HeartPulseIcon },
  { name: "both", label: "Ambos", Icon: CheckCheckIcon },
];

export default function OnboardingTraining() {
  const { data, setData } = useOnboardingContext();

  const selectedOptions = data.training ? [data.training] : [];
  const setSelectedOption = (name: string) => {
    if (
      name === "none" ||
      name === "lifting" ||
      name === "cardio" ||
      name === "both"
    ) {
      setData((prev) => ({ ...prev, training: name }));
    }
  };

  return (
    <OnboardingStep title="¿Qué tipo de entrenamiento vas a hacer durante este programa?">
      <Select
        options={options}
        selectedOptions={selectedOptions}
        onSelectOption={setSelectedOption}
      />
    </OnboardingStep>
  );
}
