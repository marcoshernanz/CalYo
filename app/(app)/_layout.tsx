import { useAuthContext } from "@/context/AuthContext";
import { Redirect, Stack } from "expo-router";

export default function AppLayout() {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/auth" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
