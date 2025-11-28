import { Platform, StyleSheet, View } from "react-native";
import Button from "@/components/ui/Button";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { makeRedirectUri } from "expo-auth-session";
import { openAuthSessionAsync } from "expo-web-browser";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Text from "@/components/ui/Text";
import GoogleLogo from "@/assets/svg/google-logo.svg";
import getColor from "@/lib/ui/getColor";
import { useState } from "react";
import logError from "@/lib/utils/logError";
import { MailIcon } from "lucide-react-native";

type Props = {
  onEmailLogin?: () => void;
  onSuccess?: () => Promise<void>;
  disabled?: boolean;
};

const redirectTo = makeRedirectUri();

export default function SignInButtons({
  onEmailLogin,
  onSuccess,
  disabled = false,
}: Props) {
  const { signIn } = useAuthContext();
  const router = useRouter();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleLogin = async (provider: "google" | "apple") => {
    if (disabled || isAuthenticating) return;
    setIsAuthenticating(true);
    try {
      const { redirect } = await signIn(provider, { redirectTo });
      if (Platform.OS === "web") {
        return;
      }
      if (!redirect) {
        console.warn("Missing redirect URL from signIn response");
        return;
      }
      const result = await openAuthSessionAsync(
        redirect.toString(),
        redirectTo
      );
      if (result.type === "success") {
        const { url } = result;
        const code = new URL(url).searchParams.get("code");
        if (!code) {
          console.warn("Authorization code not found in redirect callback");
          return;
        }
        await signIn(provider, { code });
        await onSuccess?.();
        if (router.canDismiss()) router.dismissAll();
        router.replace("/app");
      }
    } catch (error) {
      logError("Authentication error", error);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleEmailLogin = () => {
    onEmailLogin?.();
    router.navigate("/auth/sign-in");
  };

  return (
    <View style={styles.container}>
      {Platform.OS === "ios" && (
        <Button
          size="lg"
          variant="primary"
          style={styles.button}
          onPress={() => void handleLogin("apple")}
          disabled={disabled || isAuthenticating}
        >
          <FontAwesome5 name="apple" size={28} color={getColor("background")} />
          <Text
            size="16"
            weight="500"
            color={getColor("background")}
            style={styles.buttonPrimaryText}
          >
            Continuar con Apple
          </Text>
        </Button>
      )}
      <Button
        size="lg"
        variant={Platform.OS === "android" ? "primary" : "outline"}
        style={styles.button}
        onPress={() => void handleLogin("google")}
        disabled={disabled || isAuthenticating}
      >
        <GoogleLogo height={24} width={24} />
        <Text
          size="16"
          weight={Platform.OS === "android" ? undefined : "500"}
          color={Platform.OS === "android" ? getColor("background") : undefined}
        >
          Continuar con Google
        </Text>
      </Button>
      <Button
        size="lg"
        variant="outline"
        style={styles.button}
        onPress={handleEmailLogin}
        disabled={disabled || isAuthenticating}
      >
        <MailIcon size={24} color={getColor("foreground")} />
        <Text size="16" weight="500">
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
  },
  buttonOutlineText: {
    color: getColor("foreground"),
    fontWeight: 500,
  },
});
