import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import RootLayoutProvider from "@/components/RootLayoutProvider";
import { useAuthContext } from "@/context/AuthContext";

export default function RootLayout() {
  return (
    <RootLayoutProvider>
      <StatusBar style="dark" />
      <RootNavigator />
    </RootLayoutProvider>
  );
}

function RootNavigator() {
  const { isAuthenticated } = useAuthContext();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="app" />
      </Stack.Protected>

      <Stack.Screen name="onboarding" />

      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="auth" />
      </Stack.Protected>
    </Stack>
  );
}
