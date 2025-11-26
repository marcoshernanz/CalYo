import { profilesConfig } from "@/config/profilesConfig";
import { Doc } from "@/convex/_generated/dataModel";
import { ProfileData } from "@/convex/tables/profiles";
import Optional from "@/lib/typescript/optional";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

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

type Targets = Doc<"profiles">["targets"];

export type OnboardingContextValue = {
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  hasCreatedPlan: boolean;
  setHasCreatedPlan: React.Dispatch<React.SetStateAction<boolean>>;
  targets: Targets;
  setTargets: React.Dispatch<React.SetStateAction<Targets>>;
  isAuthenticated: boolean;
};

const OnboardingContext = createContext<OnboardingContextValue | undefined>(
  undefined
);

type Props = {
  children: React.ReactNode;
};

export default function OnboardingContextProvider({ children }: Props) {
  const profile = useQuery(api.profiles.getProfile.default);
  const [data, setData] = useState<OnboardingData>(
    profile?.data ?? profilesConfig.defaultDataValues
  );
  const [hasCreatedPlan, setHasCreatedPlan] = useState(false);
  const [targets, setTargets] = useState<Targets>(
    profilesConfig.defaultValues.targets
  );
  const { isAuthenticated } = useAuthContext();

  useEffect(() => {
    setHasCreatedPlan(false);
  }, [data]);

  useEffect(() => {
    if (profile?.data) {
      setData(profile.data);
    }
  }, [profile?.data]);

  return (
    <OnboardingContext.Provider
      value={{
        data,
        setData,
        hasCreatedPlan,
        setHasCreatedPlan,
        targets,
        setTargets,
        isAuthenticated,
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

const onboardingFields: (keyof ProfileData)[] = [
  "measurementSystem",
  "sex",
  "birthDate",
  "height",
  "weight",
  "weightTrend",
  "weeklyWorkouts",
  "activityLevel",
  "liftingExperience",
  "cardioExperience",
  "goal",
  "targetWeight",
  "weightChangeRate",
  "training",
];

const hasValue = <T,>(value: T | undefined | null): value is T => {
  return value !== undefined && value !== null;
};

export function isOnboardingDataComplete(
  data: OnboardingData
): data is ProfileData {
  return onboardingFields.every((field) => hasValue(data[field]));
}
