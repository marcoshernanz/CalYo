import React, { useCallback, useMemo, useRef } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import SafeArea from "@/components/ui/SafeArea";
import getColor from "@/lib/ui/getColor";
import getShadow from "@/lib/ui/getShadow";

export default function PlanInfoSheet() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  return (
    <>
      <Button
        onPress={() => {
          bottomSheetModalRef.current?.present();
        }}
        title="Present Modal"
        color="black"
      />
      <BottomSheetModal
        ref={bottomSheetModalRef}
        handleComponent={() => (
          <View
            style={{
              height: 25,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                backgroundColor: getColor("mutedForeground", 0.5),
                width: 40,
                height: 3,
                borderRadius: 999,
              }}
            ></View>
          </View>
        )}
        backgroundStyle={{ borderRadius: 25 }}
        style={styles.bottomSheet}
      >
        <BottomSheetView>
          <SafeArea edges={["bottom", "left", "right"]} style={styles.safeArea}>
            <Text>
              Awesome 🎉 Awesome 🎉 Awesome 🎉 Awesome 🎉 Awesome 🎉 Awesome 🎉
              Awesome 🎉 Awesome 🎉 Awesome 🎉 Awesome 🎉 Awesome 🎉 Awesome 🎉
              Awesome 🎉 Awesome 🎉 Awesome 🎉 Awesome 🎉 Awesome 🎉 Awesome 🎉
              Awesome 🎉 Awesome 🎉 Awesome 🎉 Awesome 🎉 Awesome 🎉 Awesome 🎉
              Awesome 🎉 Awesome 🎉 Awesome 🎉 Awesome 🎉 Awesome 🎉 Awesome 🎉
              Awesome 🎉 Awesome 🎉 Awesome 🎉 Awesome 🎉 Awesome 🎉 Awesome 🎉
              Awesome 🎉 Awesome 🎉 Awesome 🎉 Awesome 🎉 Awesome 🎉 Awesome 🎉
              Awesome 🎉 Awesome 🎉 Awesome 🎉 Awesome 🎉 Awesome 🎉 Awesome 🎉
              Awesome 🎉 Awesome 🎉 Awesome 🎉 Awesome 🎉 Awesome 🎉 Awesome 🎉
              Awesome 🎉 Awesome 🎉 Awesome 🎉 Awesome 🎉 Awesome 🎉 Awesome 🎉
              Awesome 🎉 Awesome 🎉 Awesome 🎉 Awesome 🎉 Awesome 🎉 Awesome 🎉
              Awesome 🎉 Awesome 🎉 Awesome 🎉 Awesome 🎉 Awesome 🎉 Awesome 🎉
            </Text>
          </SafeArea>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}

const styles = StyleSheet.create({
  bottomSheet: {
    borderRadius: 25,
    ...getShadow("lg", { inverted: true, opacity: 0.025 }),
  },
  safeArea: {
    backgroundColor: getColor("base"),
  },
});
