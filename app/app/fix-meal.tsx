import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRateLimit } from "@convex-dev/rate-limiter/react";
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
import { Toast } from "@/components/ui/Toast";

export default function FixMeal() {
  const { mealId } = useLocalSearchParams<{ mealId: Id<"meals"> }>();
  const router = useRouter();
  const correctMeal = useAction(api.meals.analyze.correctMeal.correctMeal);
  const [correction, setCorrection] = useState("");
  const [loading, setLoading] = useState(false);
  const { status } = useRateLimit(api.rateLimit.getCorrectMealRateLimit, {
    getServerTimeMutation: api.rateLimit.getServerTime,
  });

  const handleCorrect = async () => {
    if (!mealId || !correction.trim()) return;

    if (status && !status.ok) {
      Toast.show({
        text: "Has alcanzado el límite diario de correcciones.",
        variant: "error",
      });
      return;
    }

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
          disabled={
            loading ||
            !correction.trim() ||
            (status !== undefined && !status.ok)
          }
        >
          {loading
            ? "Corrigiendo..."
            : status !== undefined && !status.ok
              ? "Límite alcanzado"
              : "Corregir"}
        </ScreenFooterButton>
      </ScreenFooter>
    </ScreenMain>
  );
}
