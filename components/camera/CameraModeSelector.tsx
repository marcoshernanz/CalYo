import { StyleSheet, View } from "react-native";
import { CameraIcon, ScanBarcodeIcon } from "lucide-react-native";
import Card from "@/components/ui/Card";
import getColor from "@/lib/ui/getColor";
import Button from "../ui/Button";
import ProLabel from "../ProLabel";

type CameraMode = "photo" | "barcode";

const options = [
  { mode: "photo" as CameraMode, icon: CameraIcon, isPro: true },
  { mode: "barcode" as CameraMode, icon: ScanBarcodeIcon, isPro: false },
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
      {options.map(({ mode, icon: Icon, isPro }) => (
        <Button
          key={`camera-${mode}`}
          variant="base"
          size="base"
          style={styles.optionButton}
          onPress={() => {
            onSelectMode(mode);
          }}
        >
          {isPro && <ProLabel />}
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
    position: "relative",
  },
  card: {
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
});
