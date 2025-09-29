import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import Button from "@/components/ui/Button";
import Title from "@/components/ui/Title";
import getColor from "@/lib/utils/getColor";
import { MailIcon, XIcon } from "lucide-react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Text from "../ui/Text";
import GoogleLogo from "@/assets/svg/google-logo.svg";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { makeRedirectUri } from "expo-auth-session";
import { useAuthActions } from "@convex-dev/auth/react";
import { openAuthSessionAsync } from "expo-web-browser";

interface Props {
  ref: React.Ref<BottomSheetModal>;
  onAnimate?: (fromIndex: number, toIndex: number) => void;
  onClose?: () => void;
}

const redirectTo = makeRedirectUri();

export default function LoginSheet({ ref, onAnimate, onClose }: Props) {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const insets = useSafeAreaInsets();

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
    }
  };

  const handleEmailLogin = () => {
    onClose?.();
    router.navigate("/sign-in");
  };

  return (
    <BottomSheetModal
      ref={ref}
      onAnimate={onAnimate}
      handleComponent={null}
      backgroundStyle={{ borderRadius: 25 }}
    >
      <BottomSheetView
        style={[styles.container, { paddingBottom: insets.bottom }]}
      >
        <View style={styles.headerContainer}>
          <Title size="24">Iniciar Sesión</Title>
          <View style={styles.closeButtonContainer}>
            <Button
              size="sm"
              variant="secondary"
              style={styles.closeButton}
              onPress={onClose}
            >
              <XIcon size={22} />
            </Button>
          </View>
        </View>
        <View style={styles.contentContainer}>
          {Platform.OS === "ios" && (
            <Button
              size="lg"
              variant="primary"
              style={styles.button}
              onPress={() => handleLogin("apple")}
            >
              <FontAwesome5
                name="apple"
                size={28}
                color={getColor("background")}
              />
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
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: getColor("background"),
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
  },
  headerContainer: {
    height: 75,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: getColor("mutedForeground"),
  },
  closeButtonContainer: {
    height: "100%",
    aspectRatio: 1,
    position: "absolute",
    right: 0,
    top: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    borderRadius: 9999,
    aspectRatio: 1,
  },
  contentContainer: {
    gap: 20,
    paddingHorizontal: 16,
    paddingVertical: 30,
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
