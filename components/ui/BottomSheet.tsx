import React, { useRef, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import SafeArea from "@/components/ui/SafeArea";
import getColor from "@/lib/ui/getColor";
import getShadow from "@/lib/ui/getShadow";

type Props = {
  Trigger: React.ReactElement<{ onPress?: () => void }>;
  children: React.ReactNode;
};

export default function BottomSheet({ Trigger, children }: Props) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />
    ),
    []
  );

  return (
    <>
      {React.cloneElement(Trigger, {
        onPress: () => bottomSheetModalRef.current?.present(),
      })}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        backdropComponent={renderBackdrop}
        handleComponent={() => (
          <View style={styles.handleContainer}>
            <View style={styles.handle}></View>
          </View>
        )}
        backgroundStyle={{ borderRadius: 25 }}
        style={styles.bottomSheet}
      >
        <BottomSheetView>
          <SafeArea edges={["bottom", "left", "right"]} style={styles.safeArea}>
            {children}
          </SafeArea>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}

const styles = StyleSheet.create({
  handleContainer: {
    height: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  handle: {
    backgroundColor: getColor("mutedForeground", 0.5),
    width: 40,
    height: 3,
    borderRadius: 999,
  },
  bottomSheet: {
    borderRadius: 25,
    ...getShadow("lg", { inverted: true, opacity: 0.025 }),
  },
  safeArea: {
    backgroundColor: getColor("base"),
  },
});
