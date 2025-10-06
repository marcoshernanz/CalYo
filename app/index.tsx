import { Redirect } from "expo-router";

import { useAuthContext } from "@/context/AuthContext";

export default function Index() {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Redirect href="/app" />;
  } else {
    return <Redirect href="/auth" />;
  }
}
