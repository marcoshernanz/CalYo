import Select, { SelectOption } from "@/components/ui/Select";
import Title from "@/components/ui/Title";
import { useOnboardingContext } from "@/context/OnboardingContext";
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react-native";

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
      setData((prev) => ({ ...prev, goal: name }));
    }
  };

  return (
    <>
      <Title size="24">¿Cuál es tu objetivo?</Title>
      <Select
        options={options}
        selectedOptions={selectedOptions}
        onSelectOption={setSelectedOption}
      />
    </>
  );
}
