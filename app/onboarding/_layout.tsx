import { useAuthContext } from "@/context/AuthContext";
import useProfileStatus from "@/lib/hooks/useProfileStatus";
import { Redirect, Stack } from "expo-router";

export default function OnboardingLayout() {
  const { isAuthenticated, isLoading } = useAuthContext();
  const { isProfileLoading, hasCompletedOnboarding } = useProfileStatus();

  if (isLoading || (isAuthenticated && isProfileLoading)) {
    return null;
  }

  if (isAuthenticated && hasCompletedOnboarding) {
    return <Redirect href="/app" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
