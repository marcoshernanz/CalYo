import { OnboardingData } from "@/context/OnboardingContext";
import { Doc } from "@/convex/_generated/dataModel";
import macrosToKcal from "@/lib/utils/macrosToKcal";
import { WithoutSystemFields } from "convex/server";

type ProfilesConfig = {
  defaultValues: Omit<WithoutSystemFields<Doc<"profiles">>, "userId">;
  defaultDataValues: OnboardingData;
};

export const profilesConfig: ProfilesConfig = {
  defaultValues: {
    targets: {
      calories: macrosToKcal({ carbs: 200, protein: 150, fat: 80 }),
      carbs: 200,
      protein: 150,
      fat: 80,
    },
    isPro: false,
    hasCompletedOnboarding: false,
  },
  defaultDataValues: {
    measurementSystem: "metric",
    birthDate: new Date(2000, 6, 15).getTime(),
    height: 1.7,
    weight: 80,
    targetWeight: 80,
    weightChangeRate: 0.5,
  },
} as const;
