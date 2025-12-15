import Button from "@/components/ui/Button";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import {
  ArrowLeftIcon,
  CameraIcon,
  FlashlightIcon,
  FlashlightOffIcon,
  ImageIcon,
  ScanBarcodeIcon,
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import logError from "@/lib/utils/logError";
import getColor from "@/lib/ui/getColor";
import SafeArea from "@/components/ui/SafeArea";
import { useRateLimit } from "@convex-dev/rate-limiter/react";
import { api } from "@/convex/_generated/api";
import { Toast } from "@/components/ui/Toast";
import Card from "@/components/ui/Card";
import ScannerRect from "@/components/ui/ScannerRect";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [enableTorch, setEnableTorch] = useState(false);
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const isBusyRef = useRef(false);

  const [selectedOption, setSelectedOption] = useState<"photo" | "barcode">(
    "photo"
  );

  const { status } = useRateLimit(api.rateLimit.getAiFeaturesRateLimit, {
    getServerTimeMutation: api.rateLimit.getServerTime,
  });

  const navigateToMeal = ({
    uri,
    source,
  }: {
    uri: string;
    source: "camera" | "library";
  }) => {
    router.replace({
      pathname: "/app/(meal)/meal",
      params: { photoUri: uri, source },
    });
  };

  const takePhoto = async () => {
    if (!cameraRef.current || isBusyRef.current) return;

    if (status && !status.ok) {
      Toast.show({
        text: "Has alcanzado el límite diario de funciones de IA.",
        variant: "error",
      });
      return;
    }

    isBusyRef.current = true;

    try {
      const photo = await cameraRef.current.takePictureAsync();
      navigateToMeal({ uri: photo.uri, source: "camera" });
    } catch (error) {
      logError("Error taking photo", error);
    } finally {
      isBusyRef.current = false;
    }
  };

  const handleUpload = async () => {
    if (isBusyRef.current) return;

    if (status && !status.ok) {
      Toast.show({
        text: "Has alcanzado el límite diario de funciones de IA.",
        variant: "error",
      });
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsMultipleSelection: false,
      });

      if (result.canceled || !result.assets.length) return;

      const asset = result.assets.at(0);
      if (!asset?.uri) return;

      isBusyRef.current = true;
      navigateToMeal({ uri: asset.uri, source: "library" });
    } catch (error) {
      logError("Error picking photo", error);
    } finally {
      isBusyRef.current = false;
    }
  };

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission().catch((error: unknown) => {
        logError("Error requesting camera permission", error);
      });
    }
  }, [permission?.granted, requestPermission]);

  if (!permission?.granted) {
    return null;
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        ref={cameraRef}
        facing="back"
        enableTorch={enableTorch}
      />

      <SafeArea edges={["top", "left", "right"]} style={styles.safeArea}>
        <Button
          size="sm"
          style={styles.backButton}
          onPress={() => {
            router.back();
          }}
        >
          <ArrowLeftIcon color="white" size={22} />
        </Button>

        {selectedOption === "barcode" && (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: "90%",
                aspectRatio: 1.5,
                backgroundColor: "transparent",
                borderWidth: 2,
                borderRadius: 16,
                borderColor: "#FFF",
                boxShadow: [
                  {
                    offsetX: 0,
                    offsetY: 0,
                    color: `rgba(0, 0, 0, 0.5)`,
                    spreadDistance: 999,
                  },
                ],
              }}
            ></View>
          </View>
        )}
        {selectedOption === "photo" && (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 16,
            }}
          >
            <View
              style={{
                width: "90%",
                height: "90%",
              }}
            >
              <ScannerRect />
            </View>
          </View>
        )}

        <View style={styles.bottomContainer}>
          <View style={styles.optionsContainer}>
            <Button
              variant="base"
              size="base"
              style={{ flex: 1 }}
              onPress={() => {
                setSelectedOption("photo");
              }}
            >
              <Card
                style={[
                  styles.card,
                  selectedOption !== "photo" && { opacity: 0.5 },
                ]}
              >
                <CameraIcon color={getColor("foreground")} />
              </Card>
            </Button>
            <Button
              variant="base"
              size="base"
              style={{ flex: 1 }}
              onPress={() => {
                setSelectedOption("barcode");
              }}
            >
              <Card
                style={[
                  styles.card,
                  selectedOption !== "barcode" && { opacity: 0.5 },
                ]}
              >
                <ScanBarcodeIcon color={getColor("foreground")} />
              </Card>
            </Button>
          </View>
          <View style={styles.controlsContainer}>
            <Button
              variant="base"
              size="base"
              style={styles.button}
              onPress={() => {
                void handleUpload();
              }}
            >
              <ImageIcon color="white" />
            </Button>
            <View style={styles.shutterOuter}>
              <Button
                variant="base"
                size="base"
                style={styles.shutterInner}
                onPress={() => {
                  void takePhoto();
                }}
              />
            </View>
            <Button
              variant="base"
              size="base"
              style={styles.button}
              onPress={() => {
                setEnableTorch((enableTorch) => !enableTorch);
              }}
            >
              {enableTorch ? (
                <FlashlightOffIcon color="white" />
              ) : (
                <FlashlightIcon color="white" />
              )}
            </Button>
          </View>
        </View>
      </SafeArea>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: getColor("background"),
  },
  camera: {
    flex: 1,
  },
  safeArea: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
  backButton: {
    aspectRatio: 1,
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 999,
  },
  bottomContainer: {
    paddingBottom: 50,
  },
  optionsContainer: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 16,
  },
  card: {
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  button: {
    height: 56,
    width: 56,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
  },
  shutterOuter: {
    height: 72,
    width: 72,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#FFF",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    padding: 4,
  },
  shutterInner: {
    flex: 1,
    borderRadius: 999,
    backgroundColor: "#FFF",
  },
});
