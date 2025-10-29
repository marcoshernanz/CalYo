import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import RootLayoutProvider from "@/components/RootLayoutProvider";
import { useAuthContext } from "@/context/AuthContext";
import { StrictMode } from "react";

export default function RootLayout() {
  return (
    <StrictMode>
      <RootLayoutProvider>
        <StatusBar style="light" />
        <RootNavigator />
      </RootLayoutProvider>
    </StrictMode>
  );
}

function RootNavigator() {
  const { isAuthenticated } = useAuthContext();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="app" />
      </Stack.Protected>

      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="auth" />
      </Stack.Protected>
    </Stack>
  );
}
