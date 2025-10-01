import Button from "@/components/ui/Button";
import SafeArea from "@/components/ui/SafeArea";
import TextInput, { TextInputHandle } from "@/components/ui/TextInput";
import Title from "@/components/ui/Title";
import { useRouter } from "expo-router";
import { ArrowLeftIcon } from "lucide-react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { StyleSheet, View } from "react-native";
import { useRef, useState } from "react";
import { z } from "zod";
import { useAuthContext } from "@/context/AuthContext";

export default function SignInScreen() {
  const { signIn } = useAuthContext();
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

    await signIn("resend-otp", { email });

    router.navigate({ pathname: "/confirm-email", params: { email } });
  };

  return (
    <SafeArea>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={10}
      >
        <Button
          variant="secondary"
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <ArrowLeftIcon />
        </Button>
        <View style={styles.container}>
          <Title>Iniciar Sesión</Title>
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
        </View>
        <Button size="lg" onPress={handleSubmit}>
          Continuar
        </Button>
      </KeyboardAvoidingView>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    borderRadius: 9999,
    aspectRatio: 1,
  },
  container: {
    flex: 1,
    paddingVertical: 20,
    gap: 32,
  },
});
