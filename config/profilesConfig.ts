import { Doc } from "@/convex/_generated/dataModel";
import macrosToKcal from "@/lib/utils/macrosToKcal";
import { WithoutSystemFields } from "convex/server";

type ProfilesConfig = {
  defaultValues: Omit<WithoutSystemFields<Doc<"profiles">>, "userId">;
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
} as const;
