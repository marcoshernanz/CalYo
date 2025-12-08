import SafeArea, { useSafeArea } from "@/components/ui/SafeArea";
import TextInput, { TextInputHandle } from "@/components/ui/TextInput";
import { useRouter } from "expo-router";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useRef, useState } from "react";
import { z } from "zod";
import { useAuthContext } from "@/context/AuthContext";
import { ScreenMain, ScreenMainTitle } from "@/components/ui/screen/ScreenMain";
import {
  ScreenHeader,
  ScreenHeaderBackButton,
  ScreenHeaderTitle,
} from "@/components/ui/screen/ScreenHeader";
import {
  ScreenFooter,
  ScreenFooterButton,
} from "@/components/ui/screen/ScreenFooter";
import testingConfig from "@/config/testingConfig";

export default function SignInScreen() {
  const { signIn } = useAuthContext();
  const insets = useSafeArea();
  const router = useRouter();

  const [email, setEmail] = useState("");

  const inputRef = useRef<TextInputHandle>(null);

  const EmailForm = z.object({
    email: z.email(),
  });

  const handleSubmit = async () => {
    const result = EmailForm.safeParse({ email });
    if (!result.success) {
      inputRef.current?.flashError();
      return;
    }

    if (email === testingConfig.testEmail) {
      await signIn("password", {
        email,
        password: testingConfig.testPassword,
      });
      return;
    }

    await signIn("resend-otp", { email });

    router.push({ pathname: "/auth/confirm-email", params: { email } });
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
          <ScreenHeaderTitle title="Iniciar Sesión" />
        </ScreenHeader>

        <SafeArea edges={["left", "right"]}>
          <ScreenMainTitle title="Iniciar Sesión" />
          <TextInput
            label="Email"
            placeholder="example@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            ref={inputRef}
            autoFocus
          />
        </SafeArea>

        <ScreenFooter style={{ boxShadow: [] }}>
          <ScreenFooterButton onPress={() => void handleSubmit()}>
            Continuar
          </ScreenFooterButton>
        </ScreenFooter>
      </KeyboardAvoidingView>
    </ScreenMain>
  );
}
