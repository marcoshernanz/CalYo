import { Redirect, Stack } from "expo-router";
import { isSignedIn } from "..";

export default function AuthLayout() {
  if (isSignedIn) {
    return <Redirect href="/home" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Unauthenticated screens go here */}
    </Stack>
  );
}
