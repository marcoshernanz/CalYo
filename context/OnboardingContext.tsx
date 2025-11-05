import React, { createContext, useContext, useState } from "react";

export type OnboardingValues = {
  measurementSystem: "metric" | "imperial";
  sex: "male" | "female";
  weightTrend: "lose" | "maintain" | "gain" | "unsure";
  weeklyWorkouts: "0-2" | "3-5" | "6+";
  activityLevel: "low" | "medium" | "high";
  experience: "none" | "beginner" | "intermediate" | "advanced";
  goal: "lose" | "maintain" | "gain";
  training: "none" | "lifting" | "cardio" | "both";
}

export type OnboardingData = {
  measurementSystem: OnboardingValues["measurementSystem"];
  sex: OnboardingValues["sex"] | null;
  bornDate: Date;
  height: number;
  weight: number;
  weightTrend: OnboardingValues["weightTrend"] | null;
  weeklyWorkouts: OnboardingValues["weeklyWorkouts"] | null;
  activityLevel: OnboardingValues["activityLevel"] | null;
  liftingExperience: OnboardingValues["experience"] | null;
  cardioExperience: OnboardingValues["experience"] | null;
  goal: OnboardingValues["goal"] | null;
  targetWeight: number;
  weightChangeRate: number;
  training: OnboardingValues["training"] | null;
  hasCreatedPlan: boolean;
}

type OnboardingContextValue = {
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

type Props = {
  children: React.ReactNode;
}

export default function OnboardingContextProvider({ children }: Props) {
  const [section, setSection] = useState(0);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    measurementSystem: "metric",
    sex: null,
    bornDate: new Date(2000, 6, 15),
    height: 1.7,
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
