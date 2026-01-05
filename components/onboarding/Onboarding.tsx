import { useCallback, useEffect, useState } from "react";
import {
  isOnboardingDataComplete,
  OnboardingContextValue,
  useOnboardingContext,
} from "@/context/OnboardingContext";
import OnboardingBasicsSection from "./steps/basics/OnboardingBasicsSection";
import OnboardingSex from "./steps/basics/OnboardingSex";
import OnboardingBirthDate from "./steps/basics/OnboardingBirthDate";
import OnboardingHeight from "./steps/basics/OnboardingHeight";
import OnboardingWeight from "./steps/basics/OnboardingWeight";
import OnboardingWeightTrend from "./steps/basics/OnboardingWeightTrend";
import OnboardingActivityLevel from "./steps/basics/OnboardingActivityLevel";
import OnboardingLiftingExperience from "./steps/basics/OnboardingLiftingExperience";
import OnboardingCardioExperience from "./steps/basics/OnboardingCardioExperience";
import OnboardingGoalSection from "./steps/goal/OnboardingGoalSection";
import OnboardingGoal from "./steps/goal/OnboardingGoal";
import OnboardingTargetWeight from "./steps/goal/OnboardingTargetWeight";
import OnboardingWeightChangeRate from "./steps/goal/OnboardingWeightChangeRate";
import OnboardingProgramSection from "./steps/program/OnboardingProgramSection";
import OnboardingTraining from "./steps/program/OnboardingTraining";
import { useRouter } from "expo-router";
import OnboardingWeeklyWorkouts from "./steps/basics/OnboardingWeeklyWorkouts";
import OnboardingSectionLayout from "./OnboardingSectionLayout";
import OnboardingStepLayout from "./OnboardingStepLayout";
import Animated, {
  EntryAnimationsValues,
  ExitAnimationsValues,
  LayoutAnimation,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import OnboardingCreatingPlan from "./steps/end/OnboardingCreatingPlan";
import OnboardingCreateAccount from "./steps/end/OnboardingCreateAccount";
import { usePreventRemove } from "@react-navigation/native";
import { Platform } from "react-native";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import OnboardingPaywall from "./steps/end/OnboardingPaywall";

export type OnboardingSectionType = {
  name: string;
  steps: {
    screen: React.ReactElement;
    completed: (context: OnboardingContextValue) => boolean;
    skip: (context: OnboardingContextValue) => boolean;
    showHeader: boolean;
    scrollView: boolean;
    isFullScreen?: boolean;
  }[];
};

const sections: OnboardingSectionType[] = [
  {
    name: "Fundamentos",
    steps: [
      {
        screen: <OnboardingBasicsSection key="basics-section" />,
        completed: () => true,
        skip: () => false,
        showHeader: true,
        scrollView: true,
      },
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
        screen: <OnboardingWeightTrend key="weight-trend" />,
        completed: ({ data }) => data.weightTrend !== undefined,
        skip: () => false,
        showHeader: true,
        scrollView: true,
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
    ],
  },
  {
    name: "Objetivo",
    steps: [
      {
        screen: <OnboardingGoalSection key="goal-section" />,
        completed: () => true,
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
    ],
  },
  {
    name: "Programa",
    steps: [
      {
        screen: <OnboardingProgramSection key="program-section" />,
        completed: () => true,
        skip: () => false,
        showHeader: true,
        scrollView: true,
      },
      {
        screen: <OnboardingTraining key="training" />,
        completed: ({ data }) => data.training !== undefined,
        skip: () => false,
        showHeader: true,
        scrollView: true,
      },
    ],
  },
  {
    name: "Resultados",
    steps: [
      {
        screen: <OnboardingCreatingPlan key="creating-plan" />,
        completed: ({ hasCreatedPlan }) => hasCreatedPlan,
        skip: () => false,
        showHeader: false,
        scrollView: true,
      },
      {
        screen: <OnboardingCreateAccount key="creating-account" />,
        completed: ({ isAuthenticated }) => isAuthenticated,
        skip: ({ isAuthenticated }) => isAuthenticated,
        showHeader: false,
        scrollView: true,
      },
      {
        screen: <OnboardingPaywall key="paywall" />,
        completed: () => false,
        skip: () => false,
        showHeader: false,
        scrollView: false,
        isFullScreen: true,
      },
    ],
  },
];

export default function Onboarding() {
  const context = useOnboardingContext();
  const { data, targets } = context;
  const router = useRouter();
  const transitionDirection = useSharedValue<-1 | 0 | 1>(0);

  const [section, setSection] = useState(0);
  const [step, setStep] = useState(0);

  const [isCompletingOnboarding, setIsCompletingOnboarding] = useState(false);
  const completeOnboarding = useMutation(
    api.profiles.completeOnboarding.default
  );

  const currentSection = sections.at(section);
  const sectionName = currentSection?.name ?? "";
  const sectionSteps = currentSection?.steps ?? [];
  const currentStep = sectionSteps.at(step);
  const isCurrentStepComplete = currentStep?.completed(context) ?? true;
  const isNextDisabled = !isCurrentStepComplete || isCompletingOnboarding;

  const handleCompleteOnboarding = useCallback(async () => {
    if (isCompletingOnboarding) return;

    setIsCompletingOnboarding(true);
    if (!isOnboardingDataComplete(data)) return;
    await completeOnboarding({ data, targets });

    if (router.canDismiss()) router.dismissAll();
    router.replace("/app");
  }, [
    isCompletingOnboarding,
    data,
    targets,
    completeOnboarding,
    router,
    setIsCompletingOnboarding,
  ]);

  const handleNext = useCallback(async () => {
    if (isNextDisabled) return;

    transitionDirection.value = 1;

    let nextStep = step;
    let nextSection = section;
    let found = false;

    while (!found) {
      nextStep++;
      const stepsInCurrentSection = sections[nextSection]?.steps ?? [];

      if (nextStep >= stepsInCurrentSection.length) {
        nextSection++;
        if (nextSection >= sections.length) {
          await handleCompleteOnboarding();
          return;
        }
        nextStep = 0;
      }

      if (!sections[nextSection]?.steps[nextStep]?.skip(context)) {
        found = true;
      }
    }

    setSection(nextSection);
    setStep(nextStep);
  }, [
    isNextDisabled,
    step,
    section,
    context,
    transitionDirection,
    handleCompleteOnboarding,
  ]);

  const handleBack = () => {
    transitionDirection.value = -1;

    let nextStep = step;
    let nextSection = section;
    do {
      nextStep -= 1;
      if (nextStep < 0) {
        nextSection -= 1;
        if (nextSection < 0) {
          if (router.canGoBack()) {
            router.back();
          }
          return;
        }

        nextStep = sections[nextSection].steps.length - 1;
      }
    } while (sections.at(nextSection)?.steps.at(nextStep)?.skip(context));

    setSection(nextSection);
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

  const isFirstStep = section === 0 && step === 0;
  const isAndroid = Platform.OS === "android";
  usePreventRemove(!isFirstStep && isAndroid, () => {
    handleBack();
  });

  useEffect(() => {
    if (currentStep?.skip(context)) {
      void handleNext();
    }
  }, [context, currentStep, handleNext]);

  if (currentStep?.isFullScreen) {
    return currentStep.screen;
  }

  return (
    <OnboardingSectionLayout
      onNext={handleNext}
      onBack={handleBack}
      isNextDisabled={isNextDisabled}
    >
      <Animated.View
        key={`section-${section}-step-${step}`}
        style={{ flex: 1 }}
        entering={enteringAnimation}
        exiting={exitingAnimation}
      >
        <OnboardingStepLayout
          sectionName={sectionName}
          numSteps={sectionSteps.length - 1}
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
