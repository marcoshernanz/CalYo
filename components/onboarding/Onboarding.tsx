import { useCallback, useEffect, useMemo, useState } from "react";
import {
  OnboardingData,
  useOnboardingContext,
} from "@/context/OnboardingContext";
import { useWindowDimensions } from "react-native";
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
import { useNavigation, useRouter } from "expo-router";
import OnboardingWeeklyWorkouts from "./steps/basics/OnboardingWeeklyWorkouts";
import OnboardingSectionLayout from "./OnboardingSectionLayout";
import OnboardingStepLayout from "./OnboardingStepLayout";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import OnboardingCreatingPlan from "./steps/program/OnboardingCreatingPlan";
import OnboardingPlan from "./steps/program/OnboardingPlan";

type SectionType = {
  name: string;
  steps: React.ReactElement[];
};

const sections: SectionType[] = [
  {
    name: "Fundamentos",
    steps: [
      <OnboardingBasicsSection key="basics-section" />,
      <OnboardingSex key="sex" />,
      <OnboardingBirthDate key="birth-date" />,
      <OnboardingHeight key="height" />,
      <OnboardingWeight key="weight" />,
      <OnboardingWeightTrend key="weight-trend" />,
      <OnboardingWeeklyWorkouts key="weekly-workouts" />,
      <OnboardingActivityLevel key="activity-level" />,
      <OnboardingLiftingExperience key="lifting-experience" />,
      <OnboardingCardioExperience key="cardio-experience" />,
    ],
  },
  {
    name: "Objetivo",
    steps: [
      <OnboardingGoalSection key="goal-section" />,
      <OnboardingGoal key="goal" />,
      <OnboardingTargetWeight key="target-weight" />,
      <OnboardingWeightChangeRate key="weight-change-rate" />,
    ],
  },
  {
    name: "Programa",
    steps: [
      <OnboardingProgramSection key="program-section" />,
      <OnboardingTraining key="training" />,
    ],
  },
  {
    name: "End",
    steps: [
      <OnboardingCreatingPlan key="creating-plan" />,
      <OnboardingPlan key="plan" />,
    ],
  },
];

const stepCompletionCheckers: ((data: OnboardingData) => boolean)[][] = [
  [
    () => true, // Basics Section
    (data) => data.sex !== null, // Sex
    () => true, // Birth Date
    () => true, // Height
    () => true, // Weight
    (data) => data.weightTrend !== null, // Weight Trend
    (data) => data.weeklyWorkouts !== null, // Weekly Workouts
    (data) => data.activityLevel !== null, // Activity Level
    (data) => data.liftingExperience !== null, // Lifting Experience
    (data) => data.cardioExperience !== null, // Cardio Experience
  ],
  [
    () => true, // Goal Section
    (data) => data.goal !== null, // Goal
    () => true, // Target Weight
    () => true, // Weight Change Rate
  ],
  [
    () => true, // Program Section
    (data) => data.training !== null, // Training
  ],
  [
    (data) => data.hasCreatedPlan, // Creating Plan
    () => true, // Plan
  ],
];

export default function Onboarding() {
  const router = useRouter();
  const navigation = useNavigation();
  const { section, setSection, step, setStep, data } = useOnboardingContext();
  const direction = useSharedValue<1 | -1>(1);
  const { width: screenWidth } = useWindowDimensions();
  const [hasMounted, setHasMounted] = useState(false);

  const animationDuration = 250;

  const shouldSkipStep = useCallback(
    (targetSectionIndex: number, targetStepIndex: number) => {
      const targetSection = sections[targetSectionIndex];
      if (!targetSection) return false;
      const targetStepElement = targetSection.steps[targetStepIndex];
      if (!targetStepElement) return false;

      return (
        (targetStepElement.type === OnboardingTargetWeight ||
          targetStepElement.type === OnboardingWeightChangeRate) &&
        data.goal === "maintain"
      );
    },
    [data.goal]
  );

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const enteringAnimation = useMemo(() => {
    return () => {
      "worklet";
      return {
        initialValues: {
          transform: [
            {
              translateX: direction.value * screenWidth,
            },
          ],
        },
        animations: {
          transform: [
            {
              translateX: withTiming(0, { duration: animationDuration }),
            },
          ],
        },
      };
    };
  }, [direction, screenWidth, animationDuration]);

  const exitingAnimation = useMemo(() => {
    return () => {
      "worklet";
      return {
        initialValues: {
          transform: [
            {
              translateX: 0,
            },
          ],
        },
        animations: {
          transform: [
            {
              translateX: withTiming(-direction.value * screenWidth, {
                duration: animationDuration,
              }),
            },
          ],
        },
      };
    };
  }, [direction, screenWidth, animationDuration]);

  const currentSection = sections[section];
  const sectionName = currentSection.name;
  const sectionSteps = currentSection.steps;
  const currentStep = currentSection.steps[step];
  const isCurrentStepComplete =
    stepCompletionCheckers[section]?.[step]?.(data) ?? true;
  const isNextDisabled = !isCurrentStepComplete;

  const handleNext = () => {
    if (isNextDisabled) {
      return;
    }
    direction.value = 1;
    if (step < sectionSteps.length - 1) {
      let nextStepIndex = step + 1;
      while (shouldSkipStep(section, nextStepIndex)) {
        nextStepIndex += 1;
      }
      if (nextStepIndex < sectionSteps.length) {
        setStep(nextStepIndex);
        return;
      }
    }

    if (section < sections.length - 1) {
      setSection(section + 1);
      let nextSectionStep = 0;
      while (shouldSkipStep(section + 1, nextSectionStep)) {
        nextSectionStep += 1;
      }
      setStep(nextSectionStep);
    } else {
      console.log("Onboarding completed");
    }
  };

  const handleBack = useCallback(() => {
    direction.value = -1;
    if (step > 0) {
      let prevStepIndex = step - 1;
      while (prevStepIndex >= 0 && shouldSkipStep(section, prevStepIndex)) {
        prevStepIndex -= 1;
      }
      if (prevStepIndex >= 0) {
        setStep(prevStepIndex);
        return;
      }
    } else if (section > 0) {
      const prevSection = sections[section - 1];
      setSection(section - 1);
      let prevSectionStep = prevSection.steps.length - 1;
      while (
        prevSectionStep >= 0 &&
        shouldSkipStep(section - 1, prevSectionStep)
      ) {
        prevSectionStep -= 1;
      }
      setStep(prevSectionStep >= 0 ? prevSectionStep : 0);
    } else {
      router.back();
    }
  }, [direction, router, section, setSection, setStep, shouldSkipStep, step]);

  const canGoBackWithinOnboarding = step > 0 || section > 0;

  useEffect(() => {
    const subscription = navigation.addListener("beforeRemove", (event) => {
      const actionType = event.data.action.type;

      if (!canGoBackWithinOnboarding) {
        return;
      }

      if (actionType === "GO_BACK" || actionType === "POP") {
        event.preventDefault();
        handleBack();
      }
    });

    return subscription;
  }, [canGoBackWithinOnboarding, handleBack, navigation]);

  return (
    <OnboardingSectionLayout
      onNext={handleNext}
      onBack={handleBack}
      isNextDisabled={isNextDisabled}
    >
      {step === 0 || currentSection.name === "End" ? (
        <Animated.View
          style={{ flex: 1 }}
          key={`section-overview-${section}-${step}`}
          entering={hasMounted ? enteringAnimation : undefined}
          exiting={exitingAnimation}
        >
          {currentStep}
        </Animated.View>
      ) : (
        <Animated.View
          style={{ flex: 1 }}
          key={`section-layout-${section}`}
          entering={hasMounted ? enteringAnimation : undefined}
          exiting={exitingAnimation}
        >
          <OnboardingStepLayout
            sectionName={sectionName}
            numSteps={sectionSteps.length - 1}
            currentStep={step - 1}
          >
            <Animated.View
              style={{ flex: 1 }}
              key={`step-${section}-${step}`}
              entering={hasMounted ? enteringAnimation : undefined}
              exiting={exitingAnimation}
            >
              {currentStep}
            </Animated.View>
          </OnboardingStepLayout>
        </Animated.View>
      )}
    </OnboardingSectionLayout>
  );
}
