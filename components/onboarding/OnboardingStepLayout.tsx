import { Dimensions, StyleSheet, View } from "react-native";
import Title from "../ui/Title";
import getColor from "@/lib/utils/getColor";

interface Props {
  children: React.ReactNode;
  sectionName: string;
  numSteps: number;
  currentStep: number;
}

export default function OnboardingStepLayout({
  children,
  sectionName,
  numSteps,
  currentStep,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Title size="18">{sectionName}</Title>
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
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  content: {
    flex: 1,
    width: Dimensions.get("window").width,
    paddingVertical: 24,
    marginLeft: -16,
  },
});
