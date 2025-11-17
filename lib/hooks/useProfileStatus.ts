import { api } from "@/convex/_generated/api";
import { profilesConfig } from "@/config/profilesConfig";
import { Doc } from "@/convex/_generated/dataModel";
import { useAuthContext } from "@/context/AuthContext";
import { useQuery } from "convex/react";

type UseProfileStatusResult = {
  profile: Doc<"profiles"> | null;
  isProfileLoading: boolean;
  hasCompletedOnboarding: boolean;
};

export default function useProfileStatus(): UseProfileStatusResult {
  const { isAuthenticated } = useAuthContext();

  const profile =
    useQuery(
      api.profiles.getProfile.default,
      isAuthenticated ? undefined : "skip"
    ) ?? null;

  const isProfileLoading = isAuthenticated && !profile;
  const hasCompletedOnboarding =
    profile?.hasCompletedOnboarding ??
    profilesConfig.defaultValues.hasCompletedOnboarding;

  return {
    profile,
    isProfileLoading,
    hasCompletedOnboarding,
  };
}
