import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import RootLayoutProvider from "@/components/RootLayoutProvider";

export default function RootLayout() {
  return (
    <RootLayoutProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </RootLayoutProvider>
  );
}
