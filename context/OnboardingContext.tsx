import React, { createContext, useContext, useState } from "react";

type OnboardingData = {
  height: number | null;
  weight: number | null;
  age: number | null;
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
    height: null,
    weight: null,
    age: null,
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
