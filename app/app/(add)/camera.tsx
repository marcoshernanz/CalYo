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

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const isBusyRef = useRef(false);
  const [enableTorch, setEnableTorch] = useState(false);

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

      <SafeArea
        edges={["top", "left", "right"]}
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <Button
          size="sm"
          style={styles.backButton}
          onPress={() => {
            router.back();
          }}
        >
          <ArrowLeftIcon color="white" size={22} />
        </Button>

        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{ height: 100, width: 300, backgroundColor: "red" }}
          ></View>
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.optionsContainer}>
            <Button variant="base" size="base" style={{ flex: 1 }}>
              <Card style={styles.card}>
                <CameraIcon color={getColor("foreground")} />
              </Card>
            </Button>
            <Button variant="base" size="base" style={{ flex: 1 }}>
              <Card style={styles.card}>
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
  backButton: {
    aspectRatio: 1,
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 999,
  },
  camera: {
    flex: 1,
  },
  bottomContainer: {
    paddingBottom: 50,
  },
  optionsContainer: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    // alignItems: "center",
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
