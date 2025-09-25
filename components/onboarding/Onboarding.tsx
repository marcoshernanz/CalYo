import { useEffect, useMemo, useState } from "react";
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
import { useRouter } from "expo-router";
import OnboardingWeeklyWorkouts from "./steps/basics/OnboardingWeeklyWorkouts";
import OnboardingSectionLayout from "./OnboardingSectionLayout";
import OnboardingStepLayout from "./OnboardingStepLayout";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";

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
];

const stepCompletionCheckers: ((data: OnboardingData) => boolean)[][] = [
  [
    () => true,
    (data) => data.sex !== null,
    (data) => data.bornDate !== null,
    (data) => data.height !== null,
    (data) => data.weight !== null,
    (data) => data.weightTrend !== null,
    (data) => data.weeklyWorkouts !== null,
    (data) => data.activityLevel !== null,
    (data) => data.liftingExperience !== null,
    (data) => data.cardioExperience !== null,
  ],
  [
    () => true,
    (data) => data.goal !== null,
    (data) => data.targetWeight !== null,
    (data) => data.weightChangeRate !== null,
  ],
  [() => true, (data) => data.training !== null],
];

export default function Onboarding() {
  const router = useRouter();
  const { section, setSection, step, setStep, data } = useOnboardingContext();
  const direction = useSharedValue<1 | -1>(1);
  const { width: screenWidth } = useWindowDimensions();
  const [hasMounted, setHasMounted] = useState(false);

  const animationDuration = 250;

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
      setStep(step + 1);
    } else if (section < sections.length - 1) {
      setSection(section + 1);
      setStep(0);
    } else {
      console.log("Onboarding completed");
    }
  };

  const handleBack = () => {
    direction.value = -1;
    if (step > 0) {
      setStep(step - 1);
    } else if (section > 0) {
      const prevSection = sections[section - 1];
      setSection(section - 1);
      setStep(prevSection.steps.length - 1);
    } else {
      router.back();
    }
  };

  return (
    <OnboardingSectionLayout
      onNext={handleNext}
      onBack={handleBack}
      isNextDisabled={isNextDisabled}
    >
      {step === 0 ? (
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
