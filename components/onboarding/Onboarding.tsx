import { useCallback, useEffect, useState } from "react";
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
import OnboardingCreatingPlan from "./steps/end/OnboardingCreatingPlan";
import OnboardingCreateAccount from "./steps/end/OnboardingCreateAccount";

type SectionType = {
  name: string;
  steps: {
    screen: React.ReactElement;
    completed: (data: OnboardingData) => boolean;
    skip: (data: OnboardingData) => boolean;
  }[];
};

const sections: SectionType[] = [
  {
    name: "Fundamentos",
    steps: [
      {
        screen: <OnboardingBasicsSection key="basics-section" />,
        completed: () => true,
        skip: () => false,
      },
      {
        screen: <OnboardingSex key="sex" />,
        completed: (data) => data.sex !== null,
        skip: () => false,
      },
      {
        screen: <OnboardingBirthDate key="birth-date" />,
        completed: () => true,
        skip: () => false,
      },
      {
        screen: <OnboardingHeight key="height" />,
        completed: () => true,
        skip: () => false,
      },
      {
        screen: <OnboardingWeight key="weight" />,
        completed: () => true,
        skip: () => false,
      },
      {
        screen: <OnboardingWeightTrend key="weight-trend" />,
        completed: (data) => data.weightTrend !== null,
        skip: () => false,
      },
      {
        screen: <OnboardingWeeklyWorkouts key="weekly-workouts" />,
        completed: (data) => data.weeklyWorkouts !== null,
        skip: () => false,
      },
      {
        screen: <OnboardingActivityLevel key="activity-level" />,
        completed: (data) => data.activityLevel !== null,
        skip: () => false,
      },
      {
        screen: <OnboardingLiftingExperience key="lifting-experience" />,
        completed: (data) => data.liftingExperience !== null,
        skip: () => false,
      },
      {
        screen: <OnboardingCardioExperience key="cardio-experience" />,
        completed: (data) => data.cardioExperience !== null,
        skip: () => false,
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
      },
      {
        screen: <OnboardingGoal key="goal" />,
        completed: (data) => data.goal !== null,
        skip: () => false,
      },
      {
        screen: <OnboardingTargetWeight key="target-weight" />,
        completed: () => true,
        skip: (data) => data.goal === "maintain",
      },
      {
        screen: <OnboardingWeightChangeRate key="weight-change-rate" />,
        completed: () => true,
        skip: (data) => data.goal === "maintain",
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
      },
      {
        screen: <OnboardingTraining key="training" />,
        completed: (data) => data.training !== null,
        skip: () => false,
      },
    ],
  },
  {
    name: "Resultados",
    steps: [
      {
        screen: <OnboardingCreatingPlan key="creating-plan" />,
        completed: (data) => data.hasCreatedPlan,
        skip: () => false,
      },
      {
        screen: <OnboardingCreateAccount key="creating-account" />,
        completed: () => true,
        skip: () => false,
      },
    ],
  },
];

export default function Onboarding() {
  const { section, setSection, step, setStep, data } = useOnboardingContext();
  const router = useRouter();
  const navigation = useNavigation();
  // const direction = useSharedValue<1 | -1>(1);
  // const { width: screenWidth } = useWindowDimensions();
  // const [hasMounted, setHasMounted] = useState(false);

  // const animationDuration = 250;

  // const shouldSkipStep = useCallback(
  //   (targetSectionIndex: number, targetStepIndex: number) => {
  //     const targetSection = sections.at(targetSectionIndex);
  //     if (!targetSection) return false;
  //     const targetStepElement = targetSection.steps.at(targetStepIndex);
  //     if (!targetStepElement) return false;

  //     return (
  //       (targetStepElement.type === OnboardingTargetWeight ||
  //         targetStepElement.type === OnboardingWeightChangeRate) &&
  //       data.goal === "maintain"
  //     );
  //   },
  //   [data.goal]
  // );

  // useEffect(() => {
  //   setHasMounted(true);
  // }, []);

  // const enteringAnimation = () => {
  //   "worklet";
  //   return {
  //     initialValues: {
  //       transform: [
  //         {
  //           translateX: direction.value * screenWidth,
  //         },
  //       ],
  //     },
  //     animations: {
  //       transform: [
  //         {
  //           translateX: withTiming(0, { duration: animationDuration }),
  //         },
  //       ],
  //     },
  //   };
  // };

  // const exitingAnimation = () => {
  //   "worklet";
  //   return {
  //     initialValues: {
  //       transform: [
  //         {
  //           translateX: 0,
  //         },
  //       ],
  //     },
  //     animations: {
  //       transform: [
  //         {
  //           translateX: withTiming(-direction.value * screenWidth, {
  //             duration: animationDuration,
  //           }),
  //         },
  //       ],
  //     },
  //   };
  // };

  const currentSection = sections.at(section);
  const sectionName = currentSection?.name ?? "";
  const sectionSteps = currentSection?.steps ?? [];
  const currentStep = sectionSteps.at(step);
  const isCurrentStepComplete = currentStep?.completed(data) ?? true;
  const isNextDisabled = !isCurrentStepComplete;

  const handleNext = () => {
    if (isNextDisabled) return;

    // direction.value = 1;

    let nextStep = step;
    let nextSection = section;
    do {
      nextStep += 1;
      if (nextStep >= sectionSteps.length) {
        nextSection += 1;
        nextStep = 0;
        if (nextSection >= sections.length) {
          console.log("Onboarding completed");
          return;
        }
      }
    } while (sections.at(nextSection)?.steps.at(nextStep)?.skip(data));

    setSection(nextSection);
    setStep(nextStep);
  };

  const handleBack = useCallback(() => {
    // direction.value = -1;

    let nextStep = step;
    let nextSection = section;
    do {
      nextStep -= 1;

      if (nextStep < 0) {
        nextSection -= 1;
        nextStep = sections[nextSection].steps.length - 1;
        if (nextSection < 0) {
          router.back();
          return;
        }
      }
    } while (sections.at(nextSection)?.steps.at(nextStep)?.skip(data));

    setSection(nextSection);
    setStep(nextStep);
  }, [data, router, section, setSection, setStep, step]);

  useEffect(() => {
    const subscription = navigation.addListener("beforeRemove", (event) => {
      event.preventDefault();
      handleBack();
    });

    return subscription;
  }, [handleBack, navigation]);

  return (
    <OnboardingSectionLayout
      onNext={handleNext}
      onBack={handleBack}
      isNextDisabled={isNextDisabled}
    >
      {currentStep?.screen}
      {/* {step === 0 || section === 3 ? (
        <Animated.View
          style={{ flex: 1 }}
          key={`section-overview-${section}-${step}`}
          entering={hasMounted ? enteringAnimation : undefined}
          exiting={exitingAnimation}
        >
          {currentStep?.screen}
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
              {currentStep?.screen}
            </Animated.View>
          </OnboardingStepLayout>
        </Animated.View>
      )} */}
    </OnboardingSectionLayout>
  );
}
