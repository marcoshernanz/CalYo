import Button from "@/components/ui/Button";
import Description from "@/components/ui/Description";
import Header from "@/components/ui/Header";
import OTPInput from "@/components/ui/OTPInput";
import SafeArea from "@/components/ui/SafeArea";
import Text from "@/components/ui/Text";
import Title from "@/components/ui/Title";
import { useRouter } from "expo-router";
import { ArrowLeftIcon } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

export default function ConfirmEmailScreen() {
  const router = useRouter();

  const handleSubmit = () => {};

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
          <Header>
            <Title>Confirma tu Email</Title>
            <Description>
              Introduce el código que te acabamos de enviar a{" "}
              <Text size="16" style={{ fontWeight: 600 }}>
                em••••@gmail.com
              </Text>
            </Description>
          </Header>

          <OTPInput />
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
