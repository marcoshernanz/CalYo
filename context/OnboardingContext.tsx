import React, { createContext, useContext, useState } from "react";

type OnboardingData = {
  measurementSystem: "metric" | "imperial";
  sex: "male" | "female" | null;
  bornDate: Date | null;
  height: number | null;
  weight: number | null;
  weightTrend: "lose" | "maintain" | "gain" | "unsure" | null;
  weeklyWorkouts: "0-2" | "3-5" | "6+" | null;
  activityLevel: "low" | "medium" | "high" | null;
  liftingExperience: "none" | "beginner" | "intermediate" | "advanced" | null;
  cardioExperience: "none" | "beginner" | "intermediate" | "advanced" | null;
  goal: "lose" | "maintain" | "gain" | null;
  targetWeight: number | null;
  weightChangeRate: number | null;
  training: "none" | "lifting" | "cardio" | "both" | null;
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
    bornDate: null,
    height: null,
    weight: null,
    weightTrend: null,
    weeklyWorkouts: null,
    activityLevel: null,
    liftingExperience: null,
    cardioExperience: null,
    goal: null,
    targetWeight: null,
    weightChangeRate: null,
    training: null,
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
