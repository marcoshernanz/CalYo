import Button from "@/components/ui/Button";
import SafeArea from "@/components/ui/SafeArea";
import Text from "@/components/ui/Text";
import Title from "@/components/ui/Title";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import BottomSheet from "@/components/ui/BottomSheet";
import SignInButtons from "@/components/auth/SignInButtons";
import { useRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

export default function AuthScreen() {
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  return (
    <SafeArea>
      <Title style={{ textAlign: "center" }}>
        Contar calorías de forma sencilla
      </Title>
      <View style={styles.mainContainer}>
        <View style={styles.image}></View>
      </View>
      <View style={styles.footerContainer}>
        <Button
          size="lg"
          onPress={() => {
            router.navigate("/onboarding");
          }}
        >
          Comenzar
        </Button>
        <View style={styles.footerText}>
          <Text size="16" style={{ textAlign: "center" }}>
            ¿Ya tienes cuenta?
          </Text>
          <BottomSheet
            ref={bottomSheetRef}
            Trigger={
              <Button size="md" variant="text">
                Iniciar Sesión
              </Button>
            }
          >
            <SignInButtons
              onEmailLogin={() => bottomSheetRef.current?.close()}
            />
          </BottomSheet>
        </View>
      </View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  image: {
    flex: 1,
    backgroundColor: "red",
    borderRadius: 20,
  },
  footerContainer: {
    gap: 10,
    paddingBottom: 15,
  },
  footerText: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
});
