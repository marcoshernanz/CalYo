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
import { api } from "@/convex/_generated/api";
import { useRouter } from "expo-router";
import { useRateLimit } from "@convex-dev/rate-limiter/react";
import { Toast } from "@/components/ui/Toast";
import { StyleSheet } from "react-native";

export default function DescribeScreen() {
  const insets = useSafeArea();
  const router = useRouter();
  const { status } = useRateLimit(api.rateLimit.getAiFeaturesRateLimit, {
    getServerTimeMutation: api.rateLimit.getServerTime,
  });
  const [description, setDescription] = useState("");

  const handleAnalyze = () => {
    if (!description.trim()) return;

    if (status && !status.ok) {
      Toast.show({
        text: "Has alcanzado el límite diario de funciones de IA.",
        variant: "error",
      });
      return;
    }

    router.replace({
      pathname: "/app/(meal)/meal",
      params: { description },
    });
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
            style={styles.textInput}
          />
        </SafeArea>

        <ScreenFooter style={{ boxShadow: [] }}>
          <ScreenFooterButton
            onPress={handleAnalyze}
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

const styles = StyleSheet.create({
  textInput: {
    minHeight: 38,
    textAlignVertical: "top",
  },
});
