import type { ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";
import {
  useAuthActions,
  type ConvexAuthActionsContext,
} from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";

type AuthContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: ConvexAuthActionsContext["signIn"];
  signOut: ConvexAuthActionsContext["signOut"];
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export function SessionProvider({ children }: Props) {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { signIn, signOut } = useAuthActions();

  const value = useMemo<AuthContextValue>(() => {
    return {
      isAuthenticated,
      isLoading,
      signIn,
      signOut,
    };
  }, [isLoading, isAuthenticated, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
