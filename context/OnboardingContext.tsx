import { profilesConfig } from "@/config/profilesConfig";
import { ProfileData } from "@/convex/tables/profiles";
import Optional from "@/lib/typescript/optional";
import React, { createContext, useContext, useState } from "react";

export type OnboardingData = Optional<
  ProfileData,
  | "sex"
  | "weightTrend"
  | "weeklyWorkouts"
  | "activityLevel"
  | "liftingExperience"
  | "cardioExperience"
  | "goal"
  | "training"
>;

type OnboardingContextValue = {
  section: number;
  setSection: React.Dispatch<React.SetStateAction<number>>;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
};

const OnboardingContext = createContext<OnboardingContextValue | undefined>(
  undefined
);

type Props = {
  children: React.ReactNode;
};

export default function OnboardingContextProvider({ children }: Props) {
  const [section, setSection] = useState(0);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(
    profilesConfig.defaultDataValues
  );

  return (
    <OnboardingContext.Provider
      value={{
        section,
        setSection,
        step,
        setStep,
        data,
        setData,
      }}
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
