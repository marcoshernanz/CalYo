import {
  ScreenFooter,
  ScreenFooterButton,
} from "@/components/ui/screen/ScreenFooter";
import {
  ScreenHeader,
  ScreenHeaderBackButton,
  ScreenHeaderTitle,
} from "@/components/ui/screen/ScreenHeader";
import {
  ScreenMain,
  ScreenMainScrollView,
} from "@/components/ui/screen/ScreenMain";
import TextInput from "@/components/ui/TextInput";
import useScrollY from "@/lib/hooks/reanimated/useScrollY";

export default function AdjustMacrosScreen() {
  const { scrollY, onScroll } = useScrollY();

  return (
    <ScreenMain edges={[]}>
      <ScreenHeader scrollY={scrollY}>
        <ScreenHeaderBackButton />
        <ScreenHeaderTitle title="Ajustar Objetivos" />
      </ScreenHeader>

      <ScreenMainScrollView
        scrollViewProps={{ onScroll }}
        safeAreaProps={{ edges: ["left", "right"] }}
      >
        <TextInput label="Calorías" />
        <TextInput label="Calorías" />
        <TextInput label="Calorías" />
        <TextInput label="Calorías" />
      </ScreenMainScrollView>

      <ScreenFooter>
        <ScreenFooterButton>Generar Automáticamente</ScreenFooterButton>
      </ScreenFooter>
    </ScreenMain>
  );
}
