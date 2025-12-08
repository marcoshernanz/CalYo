import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  ScreenMain,
  ScreenMainScrollView,
  ScreenMainTitle,
} from "@/components/ui/screen/ScreenMain";
import {
  ScreenHeader,
  ScreenHeaderBackButton,
  ScreenHeaderTitle,
} from "@/components/ui/screen/ScreenHeader";
import {
  ScreenFooter,
  ScreenFooterButton,
} from "@/components/ui/screen/ScreenFooter";
import TextInput from "@/components/ui/TextInput";

export default function FixMeal() {
  const { mealId } = useLocalSearchParams<{ mealId: Id<"meals"> }>();
  const router = useRouter();
  const correctMeal = useAction(api.meals.analyze.correctMeal.correctMeal);
  const [correction, setCorrection] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCorrect = async () => {
    if (!mealId || !correction.trim()) return;
    setLoading(true);
    try {
      await correctMeal({ mealId, correction });
      router.dismissTo("/app");
    } catch (error) {
      console.error(error);
      alert("Error correcting meal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenMain edges={[]}>
      <ScreenHeader>
        <ScreenHeaderBackButton />
        <ScreenHeaderTitle title="Corregir Comida" />
      </ScreenHeader>

      <ScreenMainScrollView safeAreaProps={{ edges: ["left", "right"] }}>
        <ScreenMainTitle
          title="¿Qué quieres corregir?"
          description="Describe los cambios para corregir la comida"
        />
        <TextInput
          placeholder="Ej: No es pollo, es tofu."
          value={correction}
          onChangeText={setCorrection}
          multiline
          autoFocus
        />
      </ScreenMainScrollView>

      <ScreenFooter>
        <ScreenFooterButton
          onPress={() => void handleCorrect()}
          disabled={loading || !correction.trim()}
        >
          {loading ? "Corrigiendo..." : "Corregir"}
        </ScreenFooterButton>
      </ScreenFooter>
    </ScreenMain>
  );
}
