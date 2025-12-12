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

export default function DescribeScreen() {
  const insets = useSafeArea();

  const [description, setDescription] = useState("");

  // TODO: Rate-limits
  const status = { ok: true };

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
            // onPress={handleCorrect}
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
