import Button from "@/components/ui/Button";
import SafeArea from "@/components/ui/SafeArea";
import Text from "@/components/ui/Text";
import Title from "@/components/ui/Title";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
import { useRef, useState } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import LoginSheet from "@/components/auth/LoginSheet";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useRouter } from "expo-router";

export default function AuthScreen() {
  const [pointerEvents, setPointerEvents] = useState<"auto" | "none">("none");
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const overlayOpacity = useSharedValue(0);
  const router = useRouter();

  const handleAnimate = (fromIndex: number, toIndex: number) => {
    if (toIndex === -1) {
      setPointerEvents("none");
      overlayOpacity.value = withTiming(0);
    } else {
      setPointerEvents("auto");
      overlayOpacity.value = withTiming(0.75);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const handlePresentModalPress = () => {
    bottomSheetModalRef.current?.present();
  };

  return (
    <SafeArea>
      <Title style={{ textAlign: "center" }}>
        Contar calorías de forma sencilla
      </Title>
      <View style={styles.mainContainer}>
        <View style={styles.image}></View>
      </View>
      <View style={styles.footerContainer}>
        <Button size="lg" onPress={() => router.navigate("/auth/onboarding")}>
          Comenzar
        </Button>
        <View style={styles.footerText}>
          <Text size="16" style={{ textAlign: "center" }}>
            ¿Ya tienes cuenta?
          </Text>
          <Button size="md" variant="text" onPress={handlePresentModalPress}>
            Iniciar Sesión
          </Button>
        </View>
      </View>
      <TouchableWithoutFeedback
        onPress={() => bottomSheetModalRef.current?.close()}
      >
        <Animated.View
          style={[styles.overlay, animatedStyle]}
          pointerEvents={pointerEvents}
        />
      </TouchableWithoutFeedback>
      <LoginSheet
        ref={bottomSheetModalRef}
        onAnimate={handleAnimate}
        onClose={() => bottomSheetModalRef.current?.close()}
      />
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
  overlay: {
    backgroundColor: "black",
    ...StyleSheet.absoluteFillObject,
  },
});
