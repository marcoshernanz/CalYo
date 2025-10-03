import { Platform, StyleSheet, View } from "react-native";
import Button from "@/components/ui/Button";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { makeRedirectUri } from "expo-auth-session";
import { openAuthSessionAsync } from "expo-web-browser";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Text from "@/components/ui/Text";
import GoogleLogo from "@/assets/svg/google-logo.svg";
import { MailIcon } from "lucide-react-native";
import getColor from "@/lib/utils/getColor";

interface Props {
  onEmailLogin?: () => void;
}

const redirectTo = makeRedirectUri();

export default function SignInButtons({ onEmailLogin }: Props) {
  const { signIn } = useAuthContext();
  const router = useRouter();

  const handleLogin = async (provider: "google" | "apple") => {
    const { redirect } = await signIn(provider, { redirectTo });
    if (Platform.OS === "web") {
      return;
    }
    const result = await openAuthSessionAsync(redirect!.toString(), redirectTo);
    if (result.type === "success") {
      const { url } = result;
      const code = new URL(url).searchParams.get("code")!;
      await signIn(provider, { code });
      router.replace("/home");
    }
  };

  const handleEmailLogin = () => {
    onEmailLogin?.();
    router.navigate("/sign-in");
  };

  return (
    <View style={styles.container}>
      {Platform.OS === "ios" && (
        <Button
          size="lg"
          variant="primary"
          style={styles.button}
          onPress={() => handleLogin("apple")}
        >
          <FontAwesome5 name="apple" size={28} color={getColor("background")} />
          <Text size="16" style={styles.buttonPrimaryText}>
            Continuar con Apple
          </Text>
        </Button>
      )}
      <Button
        size="lg"
        variant={Platform.OS === "android" ? "primary" : "outline"}
        style={styles.button}
        onPress={() => handleLogin("google")}
      >
        <GoogleLogo height={24} width={24} />
        <Text
          size="16"
          style={
            Platform.OS === "android"
              ? styles.buttonPrimaryText
              : styles.buttonOutlineText
          }
        >
          Continuar con Google
        </Text>
      </Button>
      <Button
        size="lg"
        variant="outline"
        style={styles.button}
        onPress={handleEmailLogin}
      >
        <MailIcon size={24} color={getColor("foreground")} />
        <Text size="16" style={styles.buttonOutlineText}>
          Continuar con Email
        </Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    flexDirection: "row",
  },
  buttonPrimaryText: {
    color: getColor("background"),
    fontWeight: 500,
  },
  buttonOutlineText: {
    color: getColor("foreground"),
    fontWeight: 500,
  },
});
