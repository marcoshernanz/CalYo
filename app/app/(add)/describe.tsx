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
import { Id } from "@/convex/_generated/dataModel";

export default function DescribeScreen() {
  const insets = useSafeArea();
  const router = useRouter();
  const analyzeMealDescription = useAction(
    api.meals.analyze.analyzeMealDescription.default
  );

  const [description, setDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // TODO: Rate-limits
  const status = { ok: true };

  const handleAnalyze = async () => {
    if (!description.trim()) return;
    setIsAnalyzing(true);
    try {
      const mealId = (await analyzeMealDescription({
        description,
      })) as Id<"meals">;
      router.push(`/(meal)/${mealId}` as Href);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to analyze meal description.");
    } finally {
      setIsAnalyzing(false);
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
            disabled={!description.trim() || !status.ok || isAnalyzing}
          >
            {!status.ok
              ? "Límite alcanzado"
              : isAnalyzing
                ? "Analizando..."
                : "Analizar comida"}
          </ScreenFooterButton>
        </ScreenFooter>
      </KeyboardAvoidingView>
    </ScreenMain>
  );
}
