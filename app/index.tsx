import { Redirect } from "expo-router";
import { useAuthContext } from "@/context/AuthContext";
import useProfileStatus from "@/lib/hooks/useProfileStatus";

export default function Index() {
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

  return <Redirect href="/app" />;
}
