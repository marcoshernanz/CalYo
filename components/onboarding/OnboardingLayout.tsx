import { StyleSheet, View } from "react-native";
import Title from "../ui/Title";
import SafeArea from "../ui/SafeArea";
import getColor from "@/lib/utils/getColor";
import Button from "../ui/Button";
import { ArrowLeftIcon } from "lucide-react-native";

interface Props {
  children: React.ReactNode;
  title: string;
  header: string;
  numSteps: number;
  currentStep: number;
}

export default function OnboardingLayout({
  children,
  title,
  header,
  numSteps,
  currentStep,
}: Props) {
  return (
    <SafeArea style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Title size="20">{header}</Title>
        <View style={styles.progressContainer}>
          {Array(numSteps)
            .fill(0)
            .map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressStep,
                  {
                    backgroundColor:
                      index < currentStep
                        ? getColor("foreground")
                        : getColor("secondary"),
                  },
                ]}
              />
            ))}
        </View>
      </View>
      <View style={styles.mainContainer}>
        <Title size="24">{title}</Title>
      </View>
      <View style={styles.footerContainer}>
        <Button variant="secondary" size="md" style={styles.backButton}>
          <ArrowLeftIcon />
        </Button>
        <Button variant="primary" size="md" style={styles.nextButton}>
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
  headerContainer: {
    alignItems: "center",
    gap: 12,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  progressStep: {
    flex: 1,
    height: 5,
    borderRadius: 999,
    backgroundColor: getColor("secondary"),
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
