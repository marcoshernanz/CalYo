import React, { createContext, useContext, useState } from "react";

export type OnboardingData = {
  measurementSystem: "metric" | "imperial";
  sex: "male" | "female" | null;
  bornDate: Date;
  height: number;
  weight: number;
  weightTrend: "lose" | "maintain" | "gain" | "unsure" | null;
  weeklyWorkouts: "0-2" | "3-5" | "6+" | null;
  activityLevel: "low" | "medium" | "high" | null;
  liftingExperience: "none" | "beginner" | "intermediate" | "advanced" | null;
  cardioExperience: "none" | "beginner" | "intermediate" | "advanced" | null;
  goal: "lose" | "maintain" | "gain" | null;
  targetWeight: number;
  weightChangeRate: number;
  training: "none" | "lifting" | "cardio" | "both" | null;
  hasCreatedPlan: boolean;
};

interface OnboardingContextValue {
  section: number;
  setSection: React.Dispatch<React.SetStateAction<number>>;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
}

const OnboardingContext = createContext<OnboardingContextValue | undefined>(
  undefined
);

interface Props {
  children: React.ReactNode;
}

export default function OnboardingContextProvider({ children }: Props) {
  const [section, setSection] = useState(0);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    measurementSystem: "metric",
    sex: null,
    bornDate: new Date(2000, 6, 15),
    height: 170,
    weight: 80,
    weightTrend: null,
    weeklyWorkouts: null,
    activityLevel: null,
    liftingExperience: null,
    cardioExperience: null,
    goal: null,
    targetWeight: 80,
    weightChangeRate: 0.5,
    training: null,
    hasCreatedPlan: false,
  });

  return (
    <OnboardingContext.Provider
      value={{ section, setSection, step, setStep, data, setData }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboardingContext() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error(
      "useOnboardingContext must be used within an OnboardingContextProvider"
    );
  }
  return context;
}
