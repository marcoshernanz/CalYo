import Select, { SelectOption } from "@/components/ui/Select";
import { useOnboardingContext } from "@/context/OnboardingContext";
import { MarsIcon, VenusIcon } from "lucide-react-native";
import OnboardingStep from "../../OnboardingStep";

const options: SelectOption[] = [
  { name: "male", label: "Hombre", Icon: MarsIcon },
  { name: "female", label: "Mujer", Icon: VenusIcon },
];

export default function OnboardingSex() {
  const { data, setData } = useOnboardingContext();

  const selectedOptions = data.sex ? [data.sex] : [];
  const setSelectedOption = (name: string) => {
    if (name === "male" || name === "female") {
      setData((prev) => ({ ...prev, sex: name }));
    }
  };

  return (
    <OnboardingStep title="¿Cuál es tu sexo?">
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
