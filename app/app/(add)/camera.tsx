import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useRateLimit } from "@convex-dev/rate-limiter/react";
import { ArrowLeftIcon } from "lucide-react-native";

import Button from "@/components/ui/Button";
import SafeArea from "@/components/ui/SafeArea";
import { Toast } from "@/components/ui/Toast";
import getColor from "@/lib/ui/getColor";
import logError from "@/lib/utils/logError";
import { api } from "@/convex/_generated/api";

import CameraControls from "@/components/camera/CameraControls";
import CameraModeSelector from "@/components/camera/CameraModeSelector";
import BarcodeOverlay from "@/components/camera/BarcodeOverlay";
import PhotoOverlay from "@/components/camera/PhotoOverlay";

type CameraMode = "photo" | "barcode";

export default function CameraScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();

  const { status } = useRateLimit(api.rateLimit.getAiFeaturesRateLimit, {
    getServerTimeMutation: api.rateLimit.getServerTime,
  });

  const [enableTorch, setEnableTorch] = useState(false);
  const [selectedOption, setSelectedOption] = useState<CameraMode>("photo");

  const cameraRef = useRef<CameraView>(null);
  const isBusyRef = useRef(false);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission().catch((error: unknown) => {
        logError("Error requesting camera permission", error);
      });
    }
  }, [permission?.granted, requestPermission]);

  const checkRateLimit = () => {
    if (status && !status.ok) {
      Toast.show({
        text: "Has alcanzado el límite diario de funciones de IA.",
        variant: "error",
      });
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    if (!cameraRef.current || isBusyRef.current) return;
    if (!checkRateLimit()) return;

    isBusyRef.current = true;

    try {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo.uri) {
        router.replace({
          pathname: "/app/(meal)/meal",
          params: { photoUri: photo.uri, source: "camera" },
        });
      }
    } catch (error) {
      logError("Error taking photo", error);
    } finally {
      isBusyRef.current = false;
    }
  };

  const handleUpload = async () => {
    if (isBusyRef.current) return;
    if (!checkRateLimit()) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsMultipleSelection: false,
      });

      if (result.canceled || !result.assets.length) return;

      const asset = result.assets.at(0);
      if (!asset?.uri) return;

      isBusyRef.current = true;
      router.replace({
        pathname: "/app/(meal)/meal",
        params: { photoUri: asset.uri, source: "library" },
      });
    } catch (error) {
      logError("Error picking photo", error);
    } finally {
      isBusyRef.current = false;
    }
  };

  const handleBarcodeScanned = ({ data }: BarcodeScanningResult) => {
    if (isBusyRef.current) return;
    isBusyRef.current = true;

    try {
      router.replace({
        pathname: "/app/(meal)/meal",
        params: { barcode: data, source: "camera" },
      });
    } catch (error) {
      logError("Error scanning barcode", error);
    } finally {
      setTimeout(() => {
        isBusyRef.current = false;
      }, 1000);
    }
  };

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
        onBarcodeScanned={(data) => {
          if (selectedOption === "barcode" && !isBusyRef.current) {
            handleBarcodeScanned(data);
          }
        }}
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "upc_a", "upc_e"],
        }}
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

        {selectedOption === "barcode" && <BarcodeOverlay />}
        {selectedOption === "photo" && <PhotoOverlay />}

        <View style={styles.bottomContainer}>
          <CameraModeSelector
            selectedMode={selectedOption}
            onSelectMode={setSelectedOption}
          />

          <CameraControls
            mode={selectedOption}
            enableTorch={enableTorch}
            onToggleTorch={() => {
              setEnableTorch((prev) => !prev);
            }}
            onTakePhoto={() => void takePhoto()}
            onUpload={() => void handleUpload()}
          />
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
});
