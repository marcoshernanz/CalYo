import { StyleSheet, View } from "react-native";
import Animated, {
  interpolateColor,
  useDerivedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Title from "../ui/Title";
import getColor from "@/lib/ui/getColor";
import { Edge } from "react-native-safe-area-context";
import { ScreenHeader } from "../ui/screen/ScreenHeader";
import useScrollY from "@/lib/hooks/reanimated/useScrollY";
import { ScreenMainScrollView } from "../ui/screen/ScreenMain";

type ProgressStepProps = {
  isActive: boolean;
};

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

type Props = {
  children: React.ReactNode;
  sectionName: string;
  numSteps: number;
  currentStep: number;
  showHeader: boolean;
};

export default function OnboardingStepLayout({
  children,
  sectionName,
  numSteps,
  currentStep,
  showHeader,
}: Props) {
  const contentEdges: Edge[] = showHeader
    ? ["left", "right"]
    : ["top", "left", "right"];
  const { scrollY, onScroll } = useScrollY();

  return (
    <View style={styles.container}>
      <ScreenHeader scrollY={scrollY} safeAreaStyle={styles.headerSafeArea}>
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
      </ScreenHeader>
      <ScreenMainScrollView
        scrollViewProps={{ onScroll }}
        safeAreaProps={{ edges: contentEdges }}
      >
        {children}
      </ScreenMainScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSafeArea: {
    paddingBottom: 24,
  },
  headerContainer: {
    flex: 1,
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
  scrollView: {
    flexGrow: 1,
    paddingBottom: 24,
  },
});
