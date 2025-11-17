import { StyleSheet, View } from "react-native";
import Button from "../ui/Button";
import { ArrowLeftIcon } from "lucide-react-native";
import { ScreenFooter } from "../ui/screen/ScreenFooter";
import SafeArea from "../ui/SafeArea";

type Props = {
  children: React.ReactNode;
  onNext: () => Promise<void>;
  onBack: () => void;
  isNextDisabled?: boolean;
};

export default function OnboardingSectionLayout({
  children,
  onNext,
  onBack,
  isNextDisabled = false,
}: Props) {
  return (
    <View style={styles.container}>
      <SafeArea edges={[]}>{children}</SafeArea>
      <ScreenFooter style={{ boxShadow: [] }}>
        <Button
          variant="secondary"
          size="md"
          style={styles.backButton}
          onPress={onBack}
        >
          <ArrowLeftIcon />
        </Button>
        <Button
          variant="primary"
          size="md"
          style={styles.nextButton}
          onPress={() => void onNext()}
          disabled={isNextDisabled}
        >
          Siguiente
        </Button>
      </ScreenFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    aspectRatio: 1,
  },
  nextButton: {
    flex: 1,
  },
});
