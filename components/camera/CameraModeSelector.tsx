import { StyleSheet, View } from "react-native";
import { CameraIcon, ScanBarcodeIcon } from "lucide-react-native";
import Card from "@/components/ui/Card";
import getColor from "@/lib/ui/getColor";
import Button from "../ui/Button";

type CameraMode = "photo" | "barcode";

const options = [
  { mode: "photo" as CameraMode, icon: CameraIcon },
  { mode: "barcode" as CameraMode, icon: ScanBarcodeIcon },
];

type Props = {
  selectedMode: CameraMode;
  onSelectMode: (mode: CameraMode) => void;
};

export default function CameraModeSelector({
  selectedMode,
  onSelectMode,
}: Props) {
  return (
    <View style={styles.optionsContainer}>
      {options.map(({ mode, icon: Icon }) => (
        <Button
          key={`camera-${mode}`}
          variant="base"
          size="base"
          style={styles.optionButton}
          onPress={() => {
            onSelectMode(mode);
          }}
        >
          <Card
            style={[styles.card, selectedMode !== mode && { opacity: 0.6 }]}
          >
            <Icon color={getColor("foreground")} />
          </Card>
        </Button>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  optionsContainer: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 16,
  },
  optionButton: {
    flex: 1,
  },
  card: {
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
});
