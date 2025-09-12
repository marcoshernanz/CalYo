import { useOnboardingContext } from "@/context/OnboardingContext";
import OnboardingLayout from "./OnboardingLayout";
import OnboardingBasicsSection from "./steps/basics/OnboardingBasicsSection";
import OnboardingSex from "./steps/basics/OnboardingSex";
import OnboardingBirthDate from "./steps/basics/OnboardingBirthDate";
import OnboardingHeight from "./steps/basics/OnboardingHeight";
import OnboardingWeight from "./steps/basics/OnboardingWeight";
import OnboardingWeightTrend from "./steps/basics/OnboardingWeightTrend";
import WeeklyWorkouts from "./steps/basics/WeeklyWorkouts";
import OnboardingActivityLevel from "./steps/basics/OnboardingActivityLevel";
import OnboardingLiftingExperience from "./steps/basics/OnboardingLiftingExperience";
import OnboardingCardioExperience from "./steps/basics/OnboardingCardioExperience";
import OnboardingLongTermResults from "./steps/basics/OnboardingLongTermResults";
import OnboardingGoalSection from "./steps/goal/OnboardingGoalSection";
import OnboardingGoal from "./steps/goal/OnboardingGoal";
import OnboardingTargetWeight from "./steps/goal/OnboardingTargetWeight";
import OnboardingWeightChangeRate from "./steps/goal/OnboardingWeightChangeRate";
import OnboardingWeightChangeResult from "./steps/goal/OnboardingWeightChangeResult";
import OnboardingProgramSection from "./steps/program/OnboardingProgramSection";
import OnboardingTraining from "./steps/program/OnboardingTraining";

type SectionType = {
  name: string;
  steps: React.ReactNode[];
};

const sections: SectionType[] = [
  {
    name: "Básicos",
    steps: [
      <OnboardingBasicsSection key="basics-section" />,
      <OnboardingSex key="sex" />,
      <OnboardingBirthDate key="birth-date" />,
      <OnboardingHeight key="height" />,
      <OnboardingWeight key="weight" />,
      <OnboardingWeightTrend key="weight-trend" />,
      <WeeklyWorkouts key="weekly-workouts" />,
      <OnboardingActivityLevel key="activity-level" />,
      <OnboardingLiftingExperience key="lifting-experience" />,
      <OnboardingCardioExperience key="cardio-experience" />,
      <OnboardingLongTermResults key="long-term-results" />,
    ],
  },
  {
    name: "Objetivo",
    steps: [
      <OnboardingGoalSection key="goal-section" />,
      <OnboardingGoal key="goal" />,
      <OnboardingTargetWeight key="target-weight" />,
      <OnboardingWeightChangeRate key="weight-change-rate" />,
      <OnboardingWeightChangeResult key="weight-change-result" />,
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
  const { section, setSection, step, setStep } = useOnboardingContext();

  const currentSection = sections[section];
  const sectionName = currentSection.name;
  const sectionsSteps = currentSection.steps;
  const currentStep = currentSection.steps[step];

  const handleNext = () => {};

  const handleBack = () => {};

  return (
    <OnboardingLayout
      header={sectionName}
      numSteps={sectionsSteps.length}
      currentStep={step}
      onNext={handleNext}
      onBack={handleBack}
    >
      {currentStep}
    </OnboardingLayout>
  );
}
