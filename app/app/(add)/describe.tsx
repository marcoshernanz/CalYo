import SafeArea, { useSafeArea } from "@/components/ui/SafeArea";
import {
  ScreenFooter,
  ScreenFooterButton,
} from "@/components/ui/screen/ScreenFooter";
import {
  ScreenHeader,
  ScreenHeaderBackButton,
  ScreenHeaderTitle,
} from "@/components/ui/screen/ScreenHeader";
import { ScreenMain, ScreenMainTitle } from "@/components/ui/screen/ScreenMain";
import TextInput from "@/components/ui/TextInput";
import { useState } from "react";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Href, useRouter } from "expo-router";
import { Alert } from "react-native";
import { useRateLimit } from "@convex-dev/rate-limiter/react";
import { Toast } from "@/components/ui/Toast";

export default function DescribeScreen() {
  const insets = useSafeArea();
  const router = useRouter();
  const analyzeMealDescription = useAction(
    api.meals.analyze.analyzeMealDescription.default
  );
  const { status } = useRateLimit(api.rateLimit.getAiFeaturesRateLimit, {
    getServerTimeMutation: api.rateLimit.getServerTime,
  });
  const [description, setDescription] = useState("");

  const handleAnalyze = async () => {
    if (!description.trim()) return;

    if (status && !status.ok) {
      Toast.show({
        text: "Has alcanzado el límite diario de funciones de IA.",
        variant: "error",
      });
      return;
    }

    try {
      const mealId = await analyzeMealDescription({
        description,
      });
      router.push(`/(meal)/${mealId}` as Href);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to analyze meal description.");
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
          <ScreenHeaderTitle title="Describir Comida" />
        </ScreenHeader>

        <SafeArea edges={["left", "right"]}>
          <ScreenMainTitle
            title="¿Qué has comido?"
            description="Describe tu comida y los ingredientes"
          />
          <TextInput
            placeholder="Ej: Dos rebanadas de pan tostado con aguacate y un huevo frito"
            value={description}
            onChangeText={setDescription}
            multiline
            autoFocus
            style={{ minHeight: 38, textAlignVertical: "top" }}
          />
        </SafeArea>

        <ScreenFooter style={{ boxShadow: [] }}>
          <ScreenFooterButton
            onPress={() => void handleAnalyze()}
            disabled={
              !description.trim() || (status !== undefined && !status.ok)
            }
          >
            {status !== undefined && !status.ok
              ? "Límite alcanzado"
              : "Analizar comida"}
          </ScreenFooterButton>
        </ScreenFooter>
      </KeyboardAvoidingView>
    </ScreenMain>
  );
}
