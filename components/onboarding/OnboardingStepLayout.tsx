import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  interpolateColor,
  useDerivedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Title from "../ui/Title";
import getColor from "@/lib/utils/getColor";

interface ProgressStepProps {
  isActive: boolean;
}

function ProgressStep({ isActive }: ProgressStepProps) {
  const progress = useSharedValue(isActive ? 1 : 0);

  useDerivedValue(() => {
    progress.value = withTiming(isActive ? 1 : 0);
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [getColor("secondary"), getColor("foreground")]
      ),
    };
  });

  return <Animated.View style={[styles.progressStep, animatedStyle]} />;
}

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
              <ProgressStep key={index} isActive={index <= currentStep} />
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
