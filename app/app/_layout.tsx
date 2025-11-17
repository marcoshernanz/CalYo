import { useAuthContext } from "@/context/AuthContext";
import useProfileStatus from "@/lib/hooks/useProfileStatus";
import { Redirect, Stack } from "expo-router";

export default function AppLayout() {
  const { isAuthenticated, isLoading } = useAuthContext();
  const { isProfileLoading, hasCompletedOnboarding } = useProfileStatus();

  if (isLoading || isProfileLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/auth" />;
  }

  if (!hasCompletedOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
