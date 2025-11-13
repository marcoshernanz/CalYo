import { Doc } from "@/convex/_generated/dataModel";
import { ProfileData } from "@/convex/tables/profiles";
import macrosToKcal from "@/lib/utils/macrosToKcal";
import { WithoutSystemFields } from "convex/server";

type ProfilesConfig = {
  defaultValues: Omit<WithoutSystemFields<Doc<"profiles">>, "userId">;
  defaultDataValues: ProfileData;
};

export const profilesConfig: ProfilesConfig = {
  defaultValues: {
    targets: {
      calories: macrosToKcal({ carbs: 200, protein: 150, fat: 80 }),
      carbs: 200,
      protein: 150,
      fat: 80,
    },
    hasCompletedOnboarding: false,
  },
  defaultDataValues: {
    measurementSystem: "metric",
    birthDate: new Date(2000, 6, 15).getTime(),
    height: 1.7,
    weight: 80,
    targetWeight: 80,
    weightChangeRate: 0.5,
    hasCreatedPlan: false,
  },
} as const;
