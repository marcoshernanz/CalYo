import React from "react";
import { View, StyleSheet } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import Button from "@/components/ui/Button";
import Title from "@/components/ui/Title";
import getColor from "@/lib/utils/getColor";
import { MailIcon, XIcon } from "lucide-react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Text from "../ui/Text";
import GoogleLogo from "@/assets/svg/google-logo.svg";

interface Props {
  ref: React.Ref<BottomSheetModal>;
  onAnimate?: (fromIndex: number, toIndex: number) => void;
  onClose?: () => void;
}

export default function LoginSheet({ ref, onAnimate, onClose }: Props) {
  const handleAppleLogin = () => {};

  const handleGoogleLogin = () => {};

  const handleEmailLogin = () => {};

  return (
    <BottomSheetModal ref={ref} onAnimate={onAnimate} handleComponent={null}>
      <BottomSheetView style={styles.container}>
        <View style={styles.headerContainer}>
          <Title size="28">Iniciar Sesión</Title>
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
          <Button
            size="lg"
            variant="primary"
            style={styles.button}
            onPress={handleAppleLogin}
          >
            <FontAwesome5
              name="apple"
              size={28}
              color={getColor("background")}
            />
            <Text style={styles.buttonPrimaryText}>Continuar con Apple</Text>
          </Button>
          <Button
            size="lg"
            variant="outline"
            style={styles.button}
            onPress={handleGoogleLogin}
          >
            {/* <FontAwesome5
              name="google"
              size={24}
              color={getColor("foreground")}
            /> */}
            <GoogleLogo height={24} width={24} />
            <Text style={styles.buttonOutlineText}>Continuar con Google</Text>
          </Button>
          <Button
            size="lg"
            variant="outline"
            style={styles.button}
            onPress={handleEmailLogin}
          >
            <MailIcon size={26} color={getColor("foreground")} />
            <Text style={styles.buttonOutlineText}>Continuar con Email</Text>
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
    borderBottomWidth: 1,
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
    paddingHorizontal: 24,
    paddingVertical: 40,
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
