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
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeArea } from "@/components/ui/SafeArea";

export default function FixMealScreen() {
  const { mealId } = useLocalSearchParams<{ mealId: Id<"meals"> }>();
  const router = useRouter();
  const insets = useSafeArea();
  const correctMeal = useAction(api.meals.analyze.correctMeal.correctMeal);
  const [correction, setCorrection] = useState("");
  const { status } = useRateLimit(api.rateLimit.getAiFeaturesRateLimit, {
    getServerTimeMutation: api.rateLimit.getServerTime,
  });

  const handleCorrect = () => {
    if (!mealId || !correction.trim()) return;

    if (status && !status.ok) {
      Toast.show({
        text: "Has alcanzado el límite diario de correcciones.",
        variant: "error",
      });
      return;
    }

    try {
      void correctMeal({ mealId, correction });
      router.back();
    } catch (error) {
      console.error(error);
      alert("Error correcting meal");
    }
  };

  return (
    <ScreenMain edges={[]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={-insets.bottom + 16}
      >
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
            placeholder="Ej: No es pollo, es tofu"
            value={correction}
            onChangeText={setCorrection}
            multiline
            autoFocus
          />
        </ScreenMainScrollView>

        <ScreenFooter style={{ boxShadow: [] }}>
          <ScreenFooterButton
            onPress={handleCorrect}
            disabled={
              !correction.trim() || (status !== undefined && !status.ok)
            }
          >
            {status !== undefined && !status.ok
              ? "Límite alcanzado"
              : "Corregir"}
          </ScreenFooterButton>
        </ScreenFooter>
      </KeyboardAvoidingView>
    </ScreenMain>
  );
}
