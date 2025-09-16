import Select, { SelectOption } from "@/components/ui/Select";
import Title from "@/components/ui/Title";
import { useOnboardingContext } from "@/context/OnboardingContext";

const options: SelectOption[] = [
  { name: "low", label: "Sedentario", description: "", Icon: <></> },
  { name: "medium", label: "Algo Activo", description: "", Icon: <></> },
  { name: "high", label: "Muy Activo", description: "", Icon: <></> },
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
    <>
      <Title size="24">¿Cuál es tu nivel de actividad?</Title>
      <Select
        options={options}
        selectedOptions={selectedOptions}
        onSelectOption={setSelectedOption}
      />
    </>
  );
}
