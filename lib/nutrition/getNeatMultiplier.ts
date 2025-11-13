import { ProfileData } from "@/convex/tables/profiles";

type Params = {
  activityLevel: ProfileData["activityLevel"];
};

const neatMap: Record<ProfileData["activityLevel"], number> = {
  low: 1.25,
  medium: 1.45,
  high: 1.65,
};

export default function getNeatMultiplier({ activityLevel }: Params) {
  return neatMap[activityLevel];
}
