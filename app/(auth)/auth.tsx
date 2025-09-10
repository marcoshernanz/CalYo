import Button from "@/components/ui/Button";
import SafeArea from "@/components/ui/SafeArea";
import Text from "@/components/ui/Text";
import Title from "@/components/ui/Title";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
import { useRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import LoginSheet from "@/components/auth/LoginSheet";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function AuthScreen() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const overlayOpacity = useSharedValue(0);

  const handleAnimate = (fromIndex: number, toIndex: number) => {
    overlayOpacity.value = withTiming(toIndex === 0 ? 0.75 : 0);
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
        <Button size="lg">Comenzar</Button>
        <View style={styles.footerText}>
          <Text style={{ textAlign: "center" }}>¿Ya tienes cuenta?</Text>
          <Button
            variant="text"
            pressableProps={{ onPress: handlePresentModalPress }}
          >
            Iniciar Sesión
          </Button>
        </View>
      </View>
      <TouchableWithoutFeedback
        onPress={() => bottomSheetModalRef.current?.close()}
      >
        <Animated.View style={[styles.overlay, animatedStyle]} />
      </TouchableWithoutFeedback>
      <LoginSheet ref={bottomSheetModalRef} onAnimate={handleAnimate} />
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  image: {
    flex: 1,
    backgroundColor: "#f00",
    borderRadius: 20,
  },
  footerContainer: {
    gap: 10,
  },
  footerText: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  overlay: {
    backgroundColor: "black",
    ...StyleSheet.absoluteFillObject,
  },
});
