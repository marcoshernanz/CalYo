import Button from "@/components/ui/Button";
import SafeArea from "@/components/ui/SafeArea";
import TextInput from "@/components/ui/TextInput";
import Title from "@/components/ui/Title";
import { useRouter } from "expo-router";
import { ArrowLeftIcon } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

export default function SignIn() {
  const router = useRouter();

  return (
    <SafeArea>
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
        />
      </View>
      <Button size="lg">Comenzar</Button>
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
