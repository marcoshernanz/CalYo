import Button from "@/components/ui/Button";
import Description from "@/components/ui/Description";
import Header from "@/components/ui/Header";
import OTPInput, { OTPInputHandle } from "@/components/ui/OTPInput";
import SafeArea from "@/components/ui/SafeArea";
import Text from "@/components/ui/Text";
import Title from "@/components/ui/Title";
import { useRouter } from "expo-router";
import { ArrowLeftIcon } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import createAccurateInterval from "@/lib/utils/createAccurateInterval";
import getColor from "@/lib/utils/getColor";
import { useAuthActions } from "@convex-dev/auth/react";

export default function ConfirmEmailScreen() {
  const { signIn } = useAuthActions();
  const router = useRouter();

  const inputRef = useRef<OTPInputHandle>(null);
  const [resendIn, setResendIn] = useState(0);
  const resendTimerRef = useRef<ReturnType<
    typeof createAccurateInterval
  > | null>(null);

  const handleSubmit = (code: string) => {
    if (code.length !== 4) {
      inputRef.current?.flashError();
      return;
    }
  };

  const startResendCountdown = () => {
    if (resendIn > 0) return;

    resendTimerRef.current?.stop?.();

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

  const handleResend = () => {
    startResendCountdown();
  };

  useEffect(() => {
    return () => {
      resendTimerRef.current?.stop?.();
    };
  }, []);

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

          <OTPInput ref={inputRef} onFilled={handleSubmit} autoFocus />

          <View style={styles.footerText}>
            <Description>¿No has recibido el código?</Description>
            <Button
              size="md"
              variant="text"
              disabled={resendIn > 0}
              onPress={handleResend}
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
        </View>

        <Button size="lg" onPress={() => inputRef.current?.flashError()}>
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
  footerText: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
