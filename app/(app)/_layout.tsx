import { Redirect, Stack } from "expo-router";
import { isSignedIn } from "..";

export default function AppLayout() {
  if (!isSignedIn) {
    return <Redirect href="/auth" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Authenticated screens go here */}
    </Stack>
  );
}
