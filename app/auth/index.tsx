import Button from "@/components/ui/Button";
import SafeArea from "@/components/ui/SafeArea";
import Text from "@/components/ui/Text";
import Title from "@/components/ui/Title";
import {
  Image,
  StyleSheet,
  View,
  type ImageSourcePropType,
} from "react-native";
import { useRouter } from "expo-router";
import BottomSheet from "@/components/ui/BottomSheet";
import SignInButtons from "@/components/auth/SignInButtons";
import { useRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import getShadow from "@/lib/ui/getShadow";
import Carousel from "@/components/ui/Carousel";
import getColor from "@/lib/ui/getColor";

const carouselImages: readonly ImageSourcePropType[] = [
  require("@/assets/images/screenshot-1.png") as ImageSourcePropType,
  require("@/assets/images/screenshot-2.png") as ImageSourcePropType,
  require("@/assets/images/screenshot-3.png") as ImageSourcePropType,
];

export default function AuthScreen() {
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  return (
    <SafeArea>
      <Title style={{ textAlign: "center" }}>
        Contar calorías de forma sencilla
      </Title>
      <View style={styles.carouselContainer}>
        <Carousel showArrows infinite autoScroll>
          {carouselImages.map((source, index) => (
            <View key={`carousel-image-${index}`} style={styles.imageContainer}>
              <Image
                source={source}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
          ))}
        </Carousel>
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
  carouselContainer: {
    flex: 1,
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  image: {
    height: "100%",
    aspectRatio: 9 / 19.5,
    maxWidth: "100%",
    borderRadius: 20,
    borderColor: getColor("secondary"),
    borderWidth: 1,
    ...getShadow("lg"),
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
