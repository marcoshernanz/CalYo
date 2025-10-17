import Button from "@/components/ui/Button";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { UploadIcon } from "lucide-react-native";
import { useCallback, useEffect, useRef } from "react";
import { View } from "react-native";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();

  const cameraRef = useRef<CameraView>(null);
  const isBusyRef = useRef(false);

  const navigateToMeal = useCallback(
    (uri: string) => {
      router.navigate({
        pathname: "/app/meal",
        params: { photoUri: uri },
      });
    },
    [router]
  );

  const takePhoto = useCallback(async () => {
    if (!cameraRef.current || isBusyRef.current) return;
    isBusyRef.current = true;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: true,
      });

      navigateToMeal(photo.uri);
    } catch (error) {
      console.error("Error taking photo:", error);
    } finally {
      isBusyRef.current = false;
    }
  }, [navigateToMeal]);

  const handleUpload = useCallback(async () => {
    if (isBusyRef.current) return;

    try {
      const libraryPermission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!libraryPermission.granted) {
        console.warn("Media library permission not granted");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsMultipleSelection: false,
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.length) return;

      const asset = result.assets[0];
      if (!asset?.uri) return;

      isBusyRef.current = true;
      navigateToMeal(asset.uri);
    } catch (error) {
      console.error("Error picking photo:", error);
    } finally {
      isBusyRef.current = false;
    }
  }, [navigateToMeal]);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission().catch((error) => {
        console.error("Error requesting camera permission:", error);
      });
    }
  }, [permission?.granted, requestPermission]);

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView style={{ flex: 1 }} ref={cameraRef} facing="back" />
      <View
        style={{
          position: "absolute",
          bottom: 40,
          alignSelf: "center",
          height: 80,
          width: 80,
          borderRadius: 999,
          borderWidth: 2,
          borderColor: "#FFF",
          backgroundColor: "#00000040",
          padding: 3,
        }}
      >
        <Button
          variant="base"
          size="base"
          style={{ backgroundColor: "#FFF", flex: 1, borderRadius: 999 }}
          onPress={takePhoto}
        ></Button>
      </View>
      <Button
        variant="base"
        size="base"
        style={{
          position: "absolute",
          bottom: 40,
          right: 40,
          flex: 1,
          borderRadius: 999,
        }}
        onPress={handleUpload}
      >
        <UploadIcon color="#FFF" />
      </Button>
    </View>
  );
}
