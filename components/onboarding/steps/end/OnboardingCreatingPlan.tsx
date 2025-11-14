import Description from "@/components/ui/Description";
import Text from "@/components/ui/Text";
import Title from "@/components/ui/Title";
import getColor from "@/lib/ui/getColor";
import { CheckIcon, Loader2Icon } from "lucide-react-native";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import AnimateableText from "react-native-animateable-text";
import Animated, {
  cancelAnimation,
  Easing,
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutDown,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import {
  useOnboardingContext,
  type OnboardingData,
} from "@/context/OnboardingContext";
import OnboardingPlan from "./OnboardingPlan";
import resolveFontFamily from "@/lib/ui/resolveFontFamily";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProfileData } from "@/convex/tables/profiles";

const dailyRecommendations = [
  "Calorías",
  "Carbohidratos",
  "Proteína",
  "Grasas",
  "Micronutrientes",
];

const descriptions = [
  "Calculando Calorías...",
  "Calculando Carbohidratos...",
  "Calculando Proteína...",
  "Calculando Grasas...",
  "Calculando Micronutrientes...",
  "Plan Personalizado Creado",
];

const stageConfiguration = [
  { target: 20, descriptionIndex: 0 },
  { target: 40, descriptionIndex: 1 },
  { target: 60, descriptionIndex: 2 },
  { target: 80, descriptionIndex: 3 },
  { target: 100, descriptionIndex: 4 },
] as const;

const stageDurations = [2000, 2000, 2000, 2000, 2000] as const;

const AnimatedLoaderIcon = Animated.createAnimatedComponent(Loader2Icon);

type LucideSpinnerProps = {
  color: string;
  size?: number;
};

function LucideSpinner({ color, size = 18 }: LucideSpinnerProps) {
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 900, easing: Easing.linear }),
      -1,
      false
    );

    return () => {
      cancelAnimation(rotation);
      rotation.value = 0;
    };
  }, [rotation]);

  return (
    <AnimatedLoaderIcon
      style={animatedStyle}
      size={size}
      color={color}
      strokeWidth={2.5}
    />
  );
}

export default function OnboardingCreatingPlan() {
  const { data, setData, setTargets } = useOnboardingContext();
  const nutritionArgs = hasNutritionInputs(data)
    ? buildNutritionArgs(data)
    : "skip";
  const computedTargets = useQuery(
    api.nutrition.computeNutritionTargets.default,
    nutritionArgs
  );

  useEffect(() => {
    if (computedTargets) {
      setTargets(computedTargets);
    }
  }, [computedTargets, setTargets]);

  const progress = useSharedValue(data.hasCreatedPlan ? 100 : 0);
  const progressWidth = useSharedValue(0);
  const [currentDescriptionIndex, setCurrentDescriptionIndex] = useState(() =>
    data.hasCreatedPlan ? descriptions.length - 1 : 0
  );
  const [completedRecommendations, setCompletedRecommendations] = useState(
    () => (data.hasCreatedPlan ? dailyRecommendations.length : 0)
  );
  const [activeRecommendationIndex, setActiveRecommendationIndex] = useState<
    number | null
  >(() => (data.hasCreatedPlan ? null : 0));

  const animatedProps = {
    progress: useAnimatedProps(() => ({
      text: `${Math.round(progress.value)}%`,
    })),
  };

  const progressIndicatorStyle = useAnimatedStyle(() => ({
    width: (progressWidth.value * progress.value) / 100,
  }));

  const handleProgressLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    progressWidth.value = nativeEvent.layout.width;
  };

  useEffect(() => {
    let isCancelled = false;

    if (data.hasCreatedPlan) {
      progress.value = 100;
      setCurrentDescriptionIndex(descriptions.length - 1);
      setCompletedRecommendations(dailyRecommendations.length);
      setActiveRecommendationIndex(null);

      return () => {
        cancelAnimation(progress);
      };
    }

    const animateTo = (target: number, duration: number) =>
      new Promise<void>((resolve) => {
        progress.value = withTiming(
          target,
          { duration, easing: Easing.inOut(Easing.ease) },
          (finished) => {
            if (finished && !isCancelled) {
              scheduleOnRN(resolve);
            }
          }
        );
      });

    const runStages = async () => {
      for (let i = 0; i < stageConfiguration.length; i++) {
        const { descriptionIndex, target } = stageConfiguration.at(i) ?? {
          descriptionIndex: descriptions.length - 1,
          target: 100,
        };

        setCurrentDescriptionIndex(descriptionIndex);
        setActiveRecommendationIndex(
          i < dailyRecommendations.length ? i : null
        );

        await animateTo(target, stageDurations.at(i) ?? 2000);

        setCompletedRecommendations((prev) => {
          const next = Math.min(i + 1, dailyRecommendations.length);
          return prev === next ? prev : next;
        });

        if (i === stageConfiguration.length - 1) {
          setActiveRecommendationIndex(null);
          setCurrentDescriptionIndex(descriptions.length - 1);
        }
      }

      setData((prev) => ({ ...prev, hasCreatedPlan: true }));
    };

    void runStages();

    return () => {
      isCancelled = true;
      cancelAnimation(progress);
    };
  }, [data.hasCreatedPlan, progress, setData]);

  if (data.hasCreatedPlan) {
    return <OnboardingPlan />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <AnimateableText
          animatedProps={animatedProps.progress}
          style={styles.progressText}
        />
        <Title size="28" style={styles.title}>
          Estamos creando tu plan personalizado
        </Title>
      </View>

      <View style={styles.bottomContainer}>
        <Animated.View
          key={currentDescriptionIndex}
          entering={FadeInDown.duration(350)}
          exiting={FadeOutDown.duration(350)}
        >
          <Description style={styles.description}>
            {descriptions.at(currentDescriptionIndex) ?? ""}
          </Description>
        </Animated.View>
        <View style={styles.recommendationsContainer}>
          <View
            style={styles.progressContainer}
            onLayout={handleProgressLayout}
          >
            <Animated.View
              style={[styles.progressIndicator, progressIndicatorStyle]}
            />
          </View>
          <Title size="18" style={styles.recommendationsTitle}>
            Recomendaciones Diarias
          </Title>
          {dailyRecommendations.map((item, i) => (
            <View key={i} style={styles.recommendationContainer}>
              <Text size="16">&bull; {item}</Text>
              <View style={styles.recommendationLoading}>
                {(() => {
                  const state =
                    i < completedRecommendations
                      ? "completed"
                      : i === activeRecommendationIndex
                        ? "loading"
                        : "pending";

                  return (
                    <Animated.View
                      key={state}
                      entering={FadeIn.duration(150)}
                      exiting={FadeOut.duration(150)}
                      style={styles.recommendationAnimatedContainer}
                    >
                      {state === "completed" ? (
                        <CheckIcon
                          size={18}
                          strokeWidth={2.5}
                          color={getColor("primary")}
                        />
                      ) : state === "loading" ? (
                        <LucideSpinner color={getColor("primary")} />
                      ) : (
                        <View style={styles.recommendationPlaceholder} />
                      )}
                    </Animated.View>
                  );
                })()}
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

type NutritionQueryArgs = Pick<
  ProfileData,
  | "sex"
  | "birthDate"
  | "height"
  | "weight"
  | "weeklyWorkouts"
  | "activityLevel"
  | "liftingExperience"
  | "cardioExperience"
  | "goal"
  | "training"
  | "weightChangeRate"
>;

function hasNutritionInputs(
  data: OnboardingData
): data is OnboardingData & NutritionQueryArgs {
  return (
    data.sex !== undefined &&
    data.weeklyWorkouts !== undefined &&
    data.activityLevel !== undefined &&
    data.liftingExperience !== undefined &&
    data.cardioExperience !== undefined &&
    data.goal !== undefined &&
    data.training !== undefined
  );
}

function buildNutritionArgs(
  data: OnboardingData & NutritionQueryArgs
): NutritionQueryArgs {
  return {
    sex: data.sex,
    birthDate: data.birthDate,
    height: data.height,
    weight: data.weight,
    weeklyWorkouts: data.weeklyWorkouts,
    activityLevel: data.activityLevel,
    liftingExperience: data.liftingExperience,
    cardioExperience: data.cardioExperience,
    goal: data.goal,
    training: data.training,
    weightChangeRate: data.weightChangeRate,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 48,
  },
  topContainer: {
    alignItems: "center",
    width: "100%",
    gap: 16,
  },
  progressText: {
    alignItems: "center",
    fontSize: 48,
    fontFamily: resolveFontFamily({ weight: 600 }),
    color: getColor("foreground"),
    includeFontPadding: false,
  },
  title: {
    textAlign: "center",
    fontWeight: 600,
  },
  bottomContainer: {
    width: "100%",
    gap: 12,
  },
  description: {
    textAlign: "center",
  },
  recommendationsContainer: {
    width: "100%",
    backgroundColor: getColor("muted"),
    padding: 20,
    borderRadius: 16,
    gap: 10,
    overflow: "hidden",
  },
  progressContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: getColor("secondary"),
  },
  progressIndicator: {
    height: "100%",
    backgroundColor: getColor("primary"),
  },
  recommendationsTitle: {
    fontWeight: 600,
    paddingBottom: 8,
  },
  recommendationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recommendationLoading: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  recommendationAnimatedContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  recommendationPlaceholder: {
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: getColor("muted"),
  },
});
