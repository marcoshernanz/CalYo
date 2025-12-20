import { StyleSheet, View } from "react-native";
import {
  FlashlightIcon,
  FlashlightOffIcon,
  ImageIcon,
} from "lucide-react-native";
import Button from "@/components/ui/Button";

type Props = {
  mode: "photo" | "barcode";
  enableTorch: boolean;
  onToggleTorch: () => void;
  onTakePhoto: () => void;
  onUpload: () => void;
};

export default function CameraControls({
  mode,
  enableTorch,
  onToggleTorch,
  onTakePhoto,
  onUpload,
}: Props) {
  return (
    <View style={styles.controlsContainer}>
      <Button
        variant="base"
        size="base"
        style={styles.controlButton}
        onPress={mode === "photo" ? onUpload : undefined}
      >
        <ImageIcon color="white" />
      </Button>

      <View style={styles.shutterOuter}>
        <Button
          variant="base"
          size="base"
          style={styles.shutterInner}
          onPress={mode === "photo" ? onTakePhoto : undefined}
        />
      </View>

      <Button
        variant="base"
        size="base"
        style={styles.controlButton}
        onPress={onToggleTorch}
      >
        {enableTorch ? (
          <FlashlightOffIcon color="white" />
        ) : (
          <FlashlightIcon color="white" />
        )}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  controlButton: {
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
