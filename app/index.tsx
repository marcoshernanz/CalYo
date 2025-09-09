import { Redirect } from "expo-router";

export const isSignedIn = false;

export default function Index() {
  if (isSignedIn) {
    return <Redirect href="/home" />;
  } else {
    return <Redirect href="/auth" />;
  }
}
