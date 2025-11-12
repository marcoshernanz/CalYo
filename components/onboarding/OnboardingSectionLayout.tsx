import { StyleSheet, View } from "react-native";
import SafeArea from "../ui/SafeArea";
import Button from "../ui/Button";
import { ArrowLeftIcon } from "lucide-react-native";

type Props = {
  children: React.ReactNode;
  onBack: () => void;
  onNext: () => void;
  isNextDisabled?: boolean;
};

export default function OnboardingSectionLayout({
  children,
  onBack,
  onNext,
  isNextDisabled = false,
}: Props) {
  return (
    <SafeArea edges={["bottom"]}>
      <View style={styles.mainContainer}>{children}</View>
      <SafeArea edges={["left", "right"]} style={styles.footerContainer}>
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
          disabled={isNextDisabled}
        >
          Siguiente
        </Button>
      </SafeArea>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  footerContainer: {
    flex: 0,
    flexDirection: "row",
    gap: 6,
    paddingTop: 12,
  },
  backButton: {
    aspectRatio: 1,
  },
  nextButton: {
    flex: 1,
  },
});
