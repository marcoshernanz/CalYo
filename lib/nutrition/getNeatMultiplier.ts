import { OnboardingValues } from "@/context/OnboardingContext";

type Params = {
  activityLevel: OnboardingValues["activityLevel"];
}

const neatMap: Record<OnboardingValues["activityLevel"], number> = {
  low: 1.25,
  medium: 1.45,
  high: 1.65,
};

export default function getNeatMultiplier({ activityLevel }: Params) {
  return neatMap[activityLevel];
}
