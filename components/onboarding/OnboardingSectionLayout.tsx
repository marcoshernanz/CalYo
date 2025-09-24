import { StyleSheet, View } from "react-native";
import SafeArea from "../ui/SafeArea";
import Button from "../ui/Button";
import { ArrowLeftIcon } from "lucide-react-native";

interface Props {
  children: React.ReactNode;
  onBack?: () => void;
  onNext?: () => void;
}

export default function OnboardingSectionLayout({
  children,
  onBack,
  onNext,
}: Props) {
  return (
    <SafeArea style={styles.safeArea}>
      <View style={styles.mainContainer}>{children}</View>
      <View style={styles.footerContainer}>
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
          onPress={onNext}
        >
          Siguiente
        </Button>
      </View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    gap: 24,
  },
  mainContainer: {
    flex: 1,
  },
  footerContainer: {
    flexDirection: "row",
    gap: 6,
  },
  backButton: {
    aspectRatio: 1,
  },
  nextButton: {
    flex: 1,
  },
});
