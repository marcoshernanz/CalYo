import Select from "@/components/ui/Select";
import Title from "@/components/ui/Title";
import { MarsIcon, VenusIcon } from "lucide-react-native";
import { useState } from "react";

export default function OnboardingSex() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return (
    <>
      <Title size="24">¿Cuál es tu sexo?</Title>
      <Select
        options={[
          { name: "Hombre", label: "Hombre", Icon: MarsIcon },
          { name: "Mujer", label: "Mujer", Icon: VenusIcon },
        ]}
        selectedOptions={selectedOption ? [selectedOption] : []}
        onSelectOption={setSelectedOption}
      />
    </>
  );
}
