import Select, { SelectOption } from "@/components/ui/Select";
import { useOnboardingContext } from "@/context/OnboardingContext";
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react-native";
import OnboardingStep from "../../OnboardingStep";

const options: SelectOption[] = [
  { name: "lose", label: "Perder Peso", Icon: ArrowDownIcon },
  { name: "maintain", label: "Mantener Peso", Icon: MinusIcon },
  { name: "gain", label: "Ganar Peso", Icon: ArrowUpIcon },
];

export default function OnboardingGoal() {
  const { data, setData } = useOnboardingContext();

  const selectedOptions = data.goal ? [data.goal] : [];
  const setSelectedOption = (name: string) => {
    if (name === "lose" || name === "maintain" || name === "gain") {
      setData((prev) => ({
        ...prev,
        goal: name,
        targetWeight: name === "maintain" ? prev.weight : prev.targetWeight,
        weightChangeRate: name === "maintain" ? 0 : prev.weightChangeRate,
      }));
    }
  };

  return (
    <OnboardingStep title="¿Cuál es tu objetivo?">
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
