import Button from "@/components/ui/Button";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { View } from "react-native";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();

  const cameraRef = useRef<CameraView>(null);
  const isBusyRef = useRef(false);

  const takePhoto = async () => {
    if (!cameraRef.current || isBusyRef.current) return;
    isBusyRef.current = true;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: true,
      });

      router.navigate({
        pathname: "/app/meal",
        params: { photoUri: photo.uri },
      });
    } catch (error) {
      console.error("Error taking photo:", error);
    } finally {
      isBusyRef.current = false;
    }
  };

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
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
    </View>
  );
}
