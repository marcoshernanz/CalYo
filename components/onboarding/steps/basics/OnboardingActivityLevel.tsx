import Select, { SelectOption } from "@/components/ui/Select";
import { useOnboardingContext } from "@/context/OnboardingContext";
import { ArmchairIcon, FootprintsIcon, KayakIcon } from "lucide-react-native";
import OnboardingStep from "../../OnboardingStep";

const options: SelectOption[] = [
  {
    name: "low",
    label: "Sedentario",
    description: "Normalmente menos de 5,000 pasos al día",
    Icon: ArmchairIcon,
  },
  {
    name: "medium",
    label: "Algo Activo",
    description: "Normalmente 5,000 - 10,000 pasos al día",
    Icon: FootprintsIcon,
  },
  {
    name: "high",
    label: "Muy Activo",
    description: "Normalmente más de 10,000 pasos al día",
    Icon: KayakIcon,
  },
];

export default function OnboardingActivityLevel() {
  const { data, setData } = useOnboardingContext();

  const selectedOptions = data.activityLevel ? [data.activityLevel] : [];
  const setSelectedOption = (name: string) => {
    if (name === "low" || name === "medium" || name === "high") {
      setData((prev) => ({ ...prev, activityLevel: name }));
    }
  };

  return (
    <OnboardingStep title="¿Cuál es tu nivel de actividad?">
      <Select
        options={options}
        selectedOptions={selectedOptions}
        onSelectOption={setSelectedOption}
        animated
      />
    </OnboardingStep>
  );
}
