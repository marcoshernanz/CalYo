import AppContextProvider from "@/context/AppContext";
import { AuthContextProvider } from "@/context/AuthContext";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ConvexReactClient } from "convex/react";
import { SplashScreen } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from "react-native-safe-area-context";
import { SplashScreenController } from "./SplashScreenController";
import { PortalHost } from "@rn-primitives/portal";
import ToastProvider from "./ui/Toast";

interface Props {
  children: React.ReactNode;
}

SplashScreen.preventAutoHideAsync();

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  throw new Error(
    "EXPO_PUBLIC_CONVEX_URL must be defined to initialize ConvexReactClient"
  );
}

const convex = new ConvexReactClient(convexUrl, {
  unsavedChangesWarning: false,
});

const secureStorage = {
  getItem: SecureStore.getItemAsync,
  setItem: SecureStore.setItemAsync,
  removeItem: SecureStore.deleteItemAsync,
};

export default function RootLayoutProvider({ children }: Props) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ConvexAuthProvider
        client={convex}
        storage={
          Platform.OS === "android" || Platform.OS === "ios"
            ? secureStorage
            : undefined
        }
      >
        <AuthContextProvider>
          <SafeAreaProvider initialMetrics={initialWindowMetrics}>
            <KeyboardProvider>
              <BottomSheetModalProvider>
                <AppContextProvider>
                  <SplashScreenController />
                  {children}
                  <ToastProvider />
                  <PortalHost />
                </AppContextProvider>
              </BottomSheetModalProvider>
            </KeyboardProvider>
          </SafeAreaProvider>
        </AuthContextProvider>
      </ConvexAuthProvider>
    </GestureHandlerRootView>
  );
}
