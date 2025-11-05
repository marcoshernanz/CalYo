import React from "react";
import { View, StyleSheet } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import Button from "@/components/ui/Button";
import Title from "@/components/ui/Title";
import getColor from "@/lib/ui/getColor";
import { XIcon } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SignInButtons from "./SignInButtons";

type Props = {
  ref: React.Ref<BottomSheetModal>;
  onAnimate?: (fromIndex: number, toIndex: number) => void;
  onClose?: () => void;
}

export default function LoginSheet({ ref, onAnimate, onClose }: Props) {
  const insets = useSafeAreaInsets();

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
          <SignInButtons onEmailLogin={onClose} />
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
    aspectRatio: 1,
  },
  contentContainer: {
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
