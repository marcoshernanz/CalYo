import Button from "@/components/ui/Button";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import {
  FlashlightIcon,
  FlashlightOffIcon,
  ImageIcon,
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function CameraScreen() {
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
      console.error("Error taking photo:", error);
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

      if (result.canceled || !result.assets?.length) return;

      const asset = result.assets[0];
      if (!asset?.uri) return;

      isBusyRef.current = true;
      navigateToMeal({ uri: asset.uri, source: "library" });
    } catch (error) {
      console.error("Error picking photo:", error);
    } finally {
      isBusyRef.current = false;
    }
  };

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission().catch((error) => {
        console.error("Error requesting camera permission:", error);
      });
    }
  }, [permission?.granted, requestPermission]);

  if (!permission || !permission.granted) {
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
      <View style={styles.controlsContainer}>
        <Button
          variant="base"
          size="base"
          style={styles.button}
          onPress={handleUpload}
        >
          <ImageIcon color="white" />
        </Button>
        <View style={styles.shutterOuter}>
          <Button
            variant="base"
            size="base"
            style={styles.shutterInner}
            onPress={takePhoto}
          />
        </View>
        <Button
          variant="base"
          size="base"
          style={styles.button}
          onPress={() => setEnableTorch((enableTorch) => !enableTorch)}
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
