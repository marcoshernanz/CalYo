import { OnboardingSectionType } from "@/components/onboarding/Onboarding";
import OnboardingSectionLayout from "@/components/onboarding/OnboardingSectionLayout";
import OnboardingStepLayout from "@/components/onboarding/OnboardingStepLayout";
import OnboardingActivityLevel from "@/components/onboarding/steps/basics/OnboardingActivityLevel";
import OnboardingBirthDate from "@/components/onboarding/steps/basics/OnboardingBirthDate";
import OnboardingCardioExperience from "@/components/onboarding/steps/basics/OnboardingCardioExperience";
import OnboardingHeight from "@/components/onboarding/steps/basics/OnboardingHeight";
import OnboardingLiftingExperience from "@/components/onboarding/steps/basics/OnboardingLiftingExperience";
import OnboardingSex from "@/components/onboarding/steps/basics/OnboardingSex";
import OnboardingWeeklyWorkouts from "@/components/onboarding/steps/basics/OnboardingWeeklyWorkouts";
import OnboardingWeight from "@/components/onboarding/steps/basics/OnboardingWeight";
import OnboardingCreatingPlan from "@/components/onboarding/steps/end/OnboardingCreatingPlan";
import OnboardingGoal from "@/components/onboarding/steps/goal/OnboardingGoal";
import OnboardingTargetWeight from "@/components/onboarding/steps/goal/OnboardingTargetWeight";
import OnboardingWeightChangeRate from "@/components/onboarding/steps/goal/OnboardingWeightChangeRate";
import OnboardingTraining from "@/components/onboarding/steps/program/OnboardingTraining";
import { useOnboardingContext } from "@/context/OnboardingContext";
import { api } from "@/convex/_generated/api";
import { usePreventRemove } from "@react-navigation/native";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import Animated, {
  EntryAnimationsValues,
  ExitAnimationsValues,
  LayoutAnimation,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const steps: OnboardingSectionType["steps"] = [
  {
    screen: <OnboardingSex key="sex" />,
    completed: ({ data }) => data.sex !== undefined,
    skip: () => false,
    showHeader: true,
    scrollView: true,
  },
  {
    screen: <OnboardingBirthDate key="birth-date" />,
    completed: () => true,
    skip: () => false,
    showHeader: true,
    scrollView: false,
  },
  {
    screen: <OnboardingHeight key="height" />,
    completed: () => true,
    skip: () => false,
    showHeader: true,
    scrollView: false,
  },
  {
    screen: <OnboardingWeight key="weight" />,
    completed: () => true,
    skip: () => false,
    showHeader: true,
    scrollView: false,
  },
  {
    screen: <OnboardingWeeklyWorkouts key="weekly-workouts" />,
    completed: ({ data }) => data.weeklyWorkouts !== undefined,
    skip: () => false,
    showHeader: true,
    scrollView: true,
  },
  {
    screen: <OnboardingActivityLevel key="activity-level" />,
    completed: ({ data }) => data.activityLevel !== undefined,
    skip: () => false,
    showHeader: true,
    scrollView: true,
  },
  {
    screen: <OnboardingLiftingExperience key="lifting-experience" />,
    completed: ({ data }) => data.liftingExperience !== undefined,
    skip: () => false,
    showHeader: true,
    scrollView: true,
  },
  {
    screen: <OnboardingCardioExperience key="cardio-experience" />,
    completed: ({ data }) => data.cardioExperience !== undefined,
    skip: () => false,
    showHeader: true,
    scrollView: true,
  },
  {
    screen: <OnboardingGoal key="goal" />,
    completed: ({ data }) => data.goal !== undefined,
    skip: () => false,
    showHeader: true,
    scrollView: true,
  },
  {
    screen: <OnboardingTargetWeight key="target-weight" />,
    completed: () => true,
    skip: ({ data }) => data.goal === "maintain",
    showHeader: true,
    scrollView: false,
  },
  {
    screen: <OnboardingWeightChangeRate key="weight-change-rate" />,
    completed: () => true,
    skip: ({ data }) => data.goal === "maintain",
    showHeader: true,
    scrollView: false,
  },
  {
    screen: <OnboardingTraining key="training" />,
    completed: ({ data }) => data.training !== undefined,
    skip: () => false,
    showHeader: true,
    scrollView: true,
  },
  {
    screen: <OnboardingCreatingPlan key="creating-plan" />,
    completed: ({ hasCreatedPlan }) => hasCreatedPlan,
    skip: () => false,
    showHeader: false,
    scrollView: true,
  },
];

export default function GenerateMacroTargetsScreen() {
  const profile = useQuery(api.profiles.getProfile.default);
  const context = useOnboardingContext();
  const { setData, targets } = context;
  const router = useRouter();
  const transitionDirection = useSharedValue<-1 | 0 | 1>(0);
  const isDone = useRef(false);

  const [step, setStep] = useState(0);

  const [isUpdatingTargets, setIsUpdatingTargets] = useState(false);
  const updateProfile = useMutation(api.profiles.updateProfile.default);

  const currentStep = steps.at(step);
  const isCurrentStepComplete = currentStep?.completed(context) ?? true;
  const isNextDisabled = !isCurrentStepComplete || isUpdatingTargets;

  const handleUpdateTargets = async () => {
    if (isUpdatingTargets) return;

    setIsUpdatingTargets(true);
    await updateProfile({ profile: { targets } });
    setIsUpdatingTargets(false);

    isDone.current = true;
    router.dismissTo("/app");
  };

  const handleNext = async () => {
    if (isNextDisabled) return;

    transitionDirection.value = 1;

    let nextStep = step;
    do {
      nextStep += 1;
      if (nextStep >= steps.length) {
        await handleUpdateTargets();
        return;
      }
    } while (steps.at(nextStep)?.skip(context));

    setStep(nextStep);
  };

  const handleBack = () => {
    transitionDirection.value = -1;

    let nextStep = step;
    do {
      nextStep -= 1;
      if (nextStep < 0) {
        router.back();
        return;
      }
    } while (steps.at(nextStep)?.skip(context));

    setStep(nextStep);
  };

  const enteringAnimation = (
    values: EntryAnimationsValues
  ): LayoutAnimation => {
    "worklet";
    return {
      initialValues: {
        originX:
          values.targetOriginX + values.windowWidth * transitionDirection.value,
      },
      animations: { originX: withTiming(values.targetOriginX) },
    };
  };

  const exitingAnimation = (values: ExitAnimationsValues): LayoutAnimation => {
    "worklet";
    return {
      initialValues: { originX: values.currentOriginX },
      animations: {
        originX: withTiming(
          values.currentOriginX +
            values.windowWidth * transitionDirection.value * -1
        ),
      },
    };
  };

  const isFirstStep = step === 0;
  const isAndroid = Platform.OS === "android";
  usePreventRemove(!isFirstStep && isAndroid && !isDone.current, () => {
    handleBack();
  });

  useEffect(() => {
    if (profile?.data) {
      setData((prev) => ({ ...prev, ...profile.data }));
    }
  }, [profile, setData]);

  return (
    <OnboardingSectionLayout
      onNext={handleNext}
      onBack={handleBack}
      isNextDisabled={isNextDisabled}
      nextButtonText={step === steps.length - 1 ? "Guardar" : undefined}
    >
      <Animated.View
        key={`step-${step}`}
        style={{ flex: 1 }}
        entering={enteringAnimation}
        exiting={exitingAnimation}
      >
        <OnboardingStepLayout
          sectionName={"Ajustar Objetivos"}
          numSteps={steps.length - 2}
          currentStep={step - 1}
          showHeader={currentStep?.showHeader ?? true}
          scrollView={currentStep?.scrollView ?? true}
        >
          {currentStep?.screen}
        </OnboardingStepLayout>
      </Animated.View>
    </OnboardingSectionLayout>
  );
}
