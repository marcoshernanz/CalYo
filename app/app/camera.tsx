import Button from "@/components/ui/Button";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import {
  ArrowLeftIcon,
  FlashlightIcon,
  FlashlightOffIcon,
  ImageIcon,
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import logError from "@/lib/utils/logError";
import getColor from "@/lib/ui/getColor";
import { useSafeArea } from "@/components/ui/SafeArea";

export default function CameraScreen() {
  const insets = useSafeArea();
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const isBusyRef = useRef(false);
  const [enableTorch, setEnableTorch] = useState(false);

  const navigateToMeal = ({
    uri,
    source,
  }: {
    uri: string;
    source: "camera" | "library";
  }) => {
    router.replace({
      pathname: "/app/meal",
      params: { photoUri: uri, source },
    });
  };

  const takePhoto = async () => {
    if (!cameraRef.current || isBusyRef.current) return;
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
      <Button
        variant="base"
        size="sm"
        style={[styles.backButton, { top: insets.top, left: insets.left }]}
        onPress={() => {
          router.back();
        }}
      >
        <ArrowLeftIcon color="white" size={22} />
      </Button>

      <CameraView
        style={styles.camera}
        ref={cameraRef}
        facing="back"
        enableTorch={enableTorch}
      />
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: getColor("background"),
  },
  backButton: {
    aspectRatio: 1,
    position: "absolute",
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 999,
  },
  camera: {
    flex: 1,
  },
  controlsContainer: {
    position: "absolute",
    bottom: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
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
