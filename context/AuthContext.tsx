import type { ReactNode } from "react";
import { createContext, useContext } from "react";
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
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type Props = {
  children: ReactNode;
}

export function AuthContextProvider({ children }: Props) {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { signIn, signOut } = useAuthActions();

  const value: AuthContextValue = {
    isAuthenticated,
    isLoading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider"
    );
  }
  return context;
}
