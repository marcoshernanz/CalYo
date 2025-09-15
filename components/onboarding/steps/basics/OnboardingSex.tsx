import Select from "@/components/ui/Select";
import Title from "@/components/ui/Title";
import { useOnboardingContext } from "@/context/OnboardingContext";
import { MarsIcon, VenusIcon } from "lucide-react-native";

const options = [
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
    <>
      <Title size="24">¿Cuál es tu sexo?</Title>
      <Select
        options={options}
        selectedOptions={selectedOptions}
        onSelectOption={setSelectedOption}
      />
    </>
  );
}
