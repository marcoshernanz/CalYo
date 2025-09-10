import React from "react";
import { View, StyleSheet } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import Button from "@/components/ui/Button";
import Title from "@/components/ui/Title";
import getColor from "@/lib/utils/getColor";

interface Props {
  ref: React.Ref<BottomSheetModal>;
  onAnimate?: (fromIndex: number, toIndex: number) => void;
}

export default function LoginSheet({ ref, onAnimate }: Props) {
  return (
    <BottomSheetModal ref={ref} onAnimate={onAnimate} handleComponent={null}>
      <BottomSheetView style={styles.container}>
        <View style={styles.headerContainer}>
          <Title size="28">Iniciar Sesión</Title>
          <View style={styles.closeButtonContainer}>
            <Button>X</Button>
          </View>
        </View>
        <View style={styles.contentContainer}>
          <Button size="lg">X</Button>
          <Button size="lg" variant="outline">
            X
          </Button>
          <Button size="lg" variant="outline">
            X
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
  contentContainer: {
    gap: 20,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
});
