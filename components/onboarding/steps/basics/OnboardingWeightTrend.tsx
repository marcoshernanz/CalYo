import Select, { SelectOption } from "@/components/ui/Select";
import { useOnboardingContext } from "@/context/OnboardingContext";
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react-native";
import { IconQuestionMark } from "@tabler/icons-react-native";
import OnboardingStep from "../../OnboardingStep";

const options: SelectOption[] = [
  { name: "lose", label: "He perdido peso", Icon: ArrowDownIcon },
  { name: "gain", label: "He ganado peso", Icon: ArrowUpIcon },
  { name: "maintain", label: "Mi peso no ha cambiado", Icon: MinusIcon },
  {
    name: "unsure",
    label: "No estoy seguro",
    Icon: <IconQuestionMark size={28} />,
  },
];

export default function OnboardingWeightTrend() {
  const { data, setData } = useOnboardingContext();

  const selectedOptions = data.weightTrend ? [data.weightTrend] : [];
  const setSelectedOption = (name: string) => {
    if (
      name === "lose" ||
      name === "maintain" ||
      name === "gain" ||
      name === "unsure"
    ) {
      setData((prev) => ({ ...prev, weightTrend: name }));
    }
  };

  return (
    <OnboardingStep title="¿Cómo ha evolucionado tu peso en las últimas semanas?">
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
