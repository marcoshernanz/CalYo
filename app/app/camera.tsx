import Button from "@/components/ui/Button";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { UploadIcon } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const isBusyRef = useRef(false);
  const isFocused = useIsFocused();

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
    <View style={{ flex: 1 }}>
      <CameraView
        style={{ flex: 1 }}
        ref={cameraRef}
        facing="back"
        active={isFocused} // only run preview when focused
        // Optional: choose preview ratio close to device ratio for nicer framing
        // flash="off"
        // animateShutter
      />
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
        />
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
