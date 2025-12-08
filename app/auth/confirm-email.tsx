import Button from "@/components/ui/Button";
import {
  isOnboardingDataComplete,
  useOnboardingContext,
} from "@/context/OnboardingContext";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import OTPInput, { OTPInputHandle } from "@/components/ui/OTPInput";
import SafeArea, { useSafeArea } from "@/components/ui/SafeArea";
import Text from "@/components/ui/Text";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import createAccurateInterval from "@/lib/utils/createAccurateInterval";
import getColor from "@/lib/ui/getColor";
import tryCatch from "@/lib/utils/tryCatch";
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

export default function ConfirmEmailScreen() {
  const router = useRouter();
  const { signIn } = useAuthContext();
  const { email } = useLocalSearchParams<{ email: string }>();
  const insets = useSafeArea();
  const { data, targets } = useOnboardingContext();
  const completeOnboarding = useMutation(
    api.profiles.completeOnboarding.default
  );

  const inputRef = useRef<OTPInputHandle>(null);
  const [resendIn, setResendIn] = useState(0);
  const resendTimerRef = useRef<ReturnType<
    typeof createAccurateInterval
  > | null>(null);

  const handleSubmit = async (code: string) => {
    if (code.length !== 4) {
      inputRef.current?.flashError();
      return;
    }

    if (!email) {
      inputRef.current?.flashError();
      return;
    }

    const { error } = await tryCatch(signIn("resend-otp", { email, code }));
    if (error) {
      inputRef.current?.flashError();
    } else {
      if (isOnboardingDataComplete(data)) {
        await completeOnboarding({ data, targets });
      }
      if (router.canDismiss()) router.dismissAll();
      router.replace("/app");
    }
  };

  const startResendCountdown = () => {
    if (resendIn > 0) return;

    resendTimerRef.current?.stop();

    setResendIn(59);
    const timer = createAccurateInterval(() => {
      setResendIn((prev) => {
        const next = Math.max(0, prev - 1);
        if (next === 0) {
          timer.stop();
          resendTimerRef.current = null;
        }
        return next;
      });
    }, 1000);

    resendTimerRef.current = timer;
    timer.start();
  };

  const handleResend = async () => {
    if (!email || resendIn > 0) return;
    const { error } = await tryCatch(signIn("resend-otp", { email }));
    if (!error) {
      startResendCountdown();
    }
  };

  useEffect(() => {
    return () => {
      resendTimerRef.current?.stop();
    };
  }, []);

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
          <ScreenMainTitle
            title="Confirma tu Email"
            description={`Introduce el código que te acabamos de enviar a ${email}`}
          />

          <OTPInput
            ref={inputRef}
            onFilled={(code) => void handleSubmit(code)}
            autoFocus
          />

          <View style={styles.footerText}>
            <Text size="14" color={getColor("mutedForeground")}>
              ¿No has recibido el código?
            </Text>
            <Button
              size="sm"
              variant="text"
              disabled={resendIn > 0}
              onPress={() => void handleResend()}
              hitSlop={16}
              textProps={{
                style: {
                  color: resendIn > 0 ? getColor("mutedForeground") : undefined,
                  borderBottomColor:
                    resendIn > 0 ? getColor("mutedForeground") : undefined,
                },
              }}
            >
              {resendIn > 0 ? `Reenviar (${resendIn})` : "Reenviar"}
            </Button>
          </View>
        </SafeArea>

        <ScreenFooter style={{ boxShadow: [] }}>
          <ScreenFooterButton onPress={() => inputRef.current?.flashError()}>
            Continuar
          </ScreenFooterButton>
        </ScreenFooter>
      </KeyboardAvoidingView>
    </ScreenMain>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    gap: 32,
  },
  footerText: {
    paddingTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
