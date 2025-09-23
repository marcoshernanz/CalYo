import { useOnboardingContext } from "@/context/OnboardingContext";
import OnboardingLayout from "./OnboardingLayout";
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

type SectionType = {
  name: string;
  steps: React.ReactNode[];
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

export default function Onboarding() {
  const router = useRouter();
  const { section, setSection, step, setStep } = useOnboardingContext();

  const currentSection = sections[section];
  const sectionName = currentSection.name;
  const sectionsSteps = currentSection.steps;
  const currentStep = currentSection.steps[step];

  const handleNext = () => {
    if (step < sectionsSteps.length - 1) {
      setStep(step + 1);
    } else if (section < sections.length - 1) {
      setSection(section + 1);
      setStep(0);
    } else {
      console.log("Onboarding completed");
    }
  };

  const handleBack = () => {
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
    <OnboardingLayout
      header={sectionName}
      showHeader={step !== 0}
      numSteps={sectionsSteps.length}
      currentStep={step}
      onNext={handleNext}
      onBack={handleBack}
    >
      {currentStep}
    </OnboardingLayout>
  );
}
